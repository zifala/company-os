<?php

declare(strict_types=1);

namespace CompanyOs\Setup;

use Closure;
use CompanyOs\Support\Label;
use CompanyOs\Support\ServiceStatus;

/**
 * Recipe `setup-checklist`: each step ticks from real data, never from a
 * click. `done`: true / false from a query, null = review-only (never ticks,
 * never counts against "complete"). Never store "step done" flags.
 *
 * Register in a service provider's boot(); checks and hrefs are closures so
 * nothing queries or builds routes until all() is called:
 *
 *   SetupSteps::register('team', fn () => User::query()->active()->count() > 1, [
 *       SetupSteps::route('users', 'organization.users.index'),
 *   ]);
 *   SetupSteps::register('billing', null, [SetupSteps::route('billing', 'organization.billing.index')]);
 *   SetupSteps::services();
 *
 * Titles: app `setup.steps.<key>`; link labels: app `setup.links.<label>`.
 */
final class SetupSteps
{
    /** @var array<string, array{done: bool|Closure|null, links: list<array{0: string, 1: string|Closure}>}> */
    private static array $steps = [];

    /** @param list<array{0: string, 1: string|Closure}> $links  [label key, href or closure returning one] */
    public static function register(string $key, bool|Closure|null $done, array $links = []): void
    {
        self::$steps[$key] = ['done' => $done, 'links' => $links];
    }

    /** The "services" step: done when every ServiceStatus row is ok. */
    public static function services(string $key = 'services'): void
    {
        self::register($key, fn (): bool => ServiceStatus::allOk());
    }

    /**
     * A link whose href is a relative route URL (works behind any host), built lazily.
     *
     * @param  array<string, mixed>  $parameters
     * @return array{0: string, 1: Closure(): string}
     */
    public static function route(string $label, string $name, array $parameters = []): array
    {
        return [$label, fn (): string => route($name, $parameters, false)];
    }

    public static function flush(): void
    {
        self::$steps = [];
    }

    /** @return list<array{key: string, title: string, done: bool|null, links: list<array{label: string, href: string}>}> */
    public static function all(): array
    {
        $steps = [];

        foreach (self::$steps as $key => $step) {
            $done = $step['done'] instanceof Closure ? ($step['done'])() : $step['done'];
            $steps[] = self::step($key, $done === null ? null : (bool) $done, $step['links']);
        }

        return $steps;
    }

    /**
     * One step row. Public so an app that prefers a hand-written all() can still use it.
     *
     * @param  list<array{0: string, 1: string|Closure}>  $links
     * @return array{key: string, title: string, done: bool|null, links: list<array{label: string, href: string}>}
     */
    public static function step(string $key, ?bool $done, array $links = []): array
    {
        return [
            'key' => $key,
            'title' => Label::app('setup_steps', 'setup.steps', $key),
            'done' => $done,
            'links' => array_map(fn (array $link): array => [
                'label' => Label::app('setup_links', 'setup.links', $link[0]),
                'href' => $link[1] instanceof Closure ? (string) ($link[1])() : $link[1],
            ], $links),
        ];
    }

    /**
     * Every checkable step is done. Review-only steps (null) are ignored.
     * Informational only: finishing setup is always allowed.
     *
     * @param  list<array{done: bool|null}>|null  $steps
     */
    public static function complete(?array $steps = null): bool
    {
        foreach ($steps ?? self::all() as $step) {
            if ($step['done'] === false) {
                return false;
            }
        }

        return true;
    }

    /** Status badge word for a step: Done / To do / Review. */
    public static function status(?bool $done): string
    {
        return (string) __('company-os::setup.status.'.match ($done) {
            true => 'done',
            false => 'todo',
            null => 'review',
        });
    }
}

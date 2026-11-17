<?php

declare(strict_types=1);

namespace CompanyOs\Trash;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

/**
 * One trashable model, registered with TrashBin::register(). Fluent:
 *
 *   TrashType::make('clients', Client::class)
 *       ->visibleWhen(fn (User $user) => $user->can('clients.delete'))
 *       ->scope(fn (Builder $query, User $user) => $query->visibleTo($user))
 *       ->recordVisibleWhen(fn (Client $row, User $user) => $user->can('delete', $row))
 *       ->row(fn (Client $row) => ['label' => $row->name, 'context' => $row->city])
 *       ->parent('parent_id')
 *       ->beforePurge(fn (Collection $ids) => Reminder::whereMorphedTo(...)->delete())
 *       ->withFiles();
 */
final class TrashType
{
    public ?Closure $visible = null;

    public ?Closure $scope = null;

    public ?Closure $recordVisible = null;

    public ?Closure $row = null;

    public ?string $parentColumn = null;

    /** @var class-string<Model>|null */
    public ?string $parentModel = null;

    public ?Closure $beforePurge = null;

    public bool $withFiles = false;

    /** @param class-string<Model> $model */
    public function __construct(public readonly string $key, public readonly string $model) {}

    /** @param class-string<Model> $model */
    public static function make(string $key, string $model): self
    {
        return new self($key, $model);
    }

    /** Section gate, e.g. `$user->can('<module>.delete')`. Required: without one the type is hidden from everyone (deny by default). */
    public function visibleWhen(Closure $visible): self
    {
        $this->visible = $visible;

        return $this;
    }

    /** Scope the trashed query to what the user may see (same as the index page's visibleTo). */
    public function scope(Closure $scope): self
    {
        $this->scope = $scope;

        return $this;
    }

    /** Per-record filter, e.g. `$user->can('delete', $record)`. Runs in PHP on each candidate row. */
    public function recordVisibleWhen(Closure $recordVisible): self
    {
        $this->recordVisible = $recordVisible;

        return $this;
    }

    /** Map a trashed record to `['label' => string, 'context' => ?string]`. Default label: `name` attribute. */
    public function row(Closure $row): self
    {
        $this->row = $row;

        return $this;
    }

    /**
     * Parent-child: list only roots of a deletion (no parent, or parent alive).
     * For a self-reference (no $model), purge also nulls this column on rows
     * (trashed or not) that point at purged rows. Children in another table:
     * null their FK in beforePurge().
     *
     * @param  class-string<Model>|null  $model  parent model; defaults to this type's model (self-reference)
     */
    public function parent(string $column, ?string $model = null): self
    {
        $this->parentColumn = $column;
        $this->parentModel = $model ?? $this->model;

        return $this;
    }

    /** Detach polymorphic links and null history-keeping FKs before force delete. Receives a chunk of ids. */
    public function beforePurge(Closure $beforePurge): self
    {
        $this->beforePurge = $beforePurge;

        return $this;
    }

    /** Force delete model by model (outside the DB transaction) so attached media / files are removed. */
    public function withFiles(bool $withFiles = true): self
    {
        $this->withFiles = $withFiles;

        return $this;
    }

    public function isVisibleTo(mixed $user): bool
    {
        return $this->visible !== null && (bool) ($this->visible)($user);
    }

    /** @return Builder<Model> */
    public function trashedQuery(): Builder
    {
        /** @var Builder<Model> $query */
        $query = ($this->model)::query();

        return $query->onlyTrashed();
    }

    /** The model's qualified soft-delete column; honours a custom `DELETED_AT`. */
    public function deletedAtColumn(): string
    {
        return $this->trashedQuery()->getModel()->getQualifiedDeletedAtColumn();
    }

    /** @param Collection<int, mixed> $ids */
    public function runBeforePurge(Collection $ids): void
    {
        if ($this->beforePurge !== null) {
            ($this->beforePurge)($ids);
        }
    }
}

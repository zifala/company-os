<?php

declare(strict_types=1);

namespace CompanyOs\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Recipe `audit`: shared by every serious endpoint (reject, send back,
 * disable, revoke, delete, lose). The guard lives in the Action, not here.
 *
 * Extend it when an endpoint needs more fields:
 *   public function rules(): array { return [...parent::rules(), 'note' => [...]]; }
 */
class ReasonRequest extends FormRequest
{
    public const int MinLength = 3;

    public const int MaxLength = 1000;

    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<string>> */
    public function rules(): array
    {
        return ['reason' => self::reasonRules()];
    }

    /**
     * The rule list on its own, for requests that cannot extend this class.
     *
     * @return list<string>
     */
    public static function reasonRules(): array
    {
        return ['required', 'string', 'min:'.self::MinLength, 'max:'.self::MaxLength];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return ['reason' => (string) __('company-os::reason.attribute')];
    }

    public function reason(): string
    {
        return trim((string) $this->validated('reason'));
    }
}

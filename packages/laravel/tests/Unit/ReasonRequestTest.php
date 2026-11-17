<?php

declare(strict_types=1);

use CompanyOs\Http\Requests\ReasonRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

it('requires a reason between 3 and 1000 characters', function (mixed $reason, bool $passes): void {
    $data = $reason === null ? [] : ['reason' => $reason];

    expect(Validator::make($data, (new ReasonRequest)->rules())->passes())->toBe($passes);
})->with([
    'missing' => [null, false],
    'empty' => ['', false],
    'two chars' => ['ab', false],
    'three chars' => ['abc', true],
    '1000 chars' => [str_repeat('a', 1000), true],
    '1001 chars' => [str_repeat('a', 1001), false],
    'not a string' => [['x'], false],
]);

it('keeps the recipe constants', function (): void {
    expect(ReasonRequest::MinLength)->toBe(3)
        ->and(ReasonRequest::MaxLength)->toBe(1000)
        ->and(ReasonRequest::reasonRules())->toBe(['required', 'string', 'min:3', 'max:1000']);
});

it('returns 422 on reason without one and hands the reason to the action with one', function (): void {
    Route::post('records/{id}/reject', fn (ReasonRequest $request) => ['reason' => $request->reason()]);

    $this->postJson('records/1/reject')->assertStatus(422)->assertJsonValidationErrors('reason');
    $this->postJson('records/1/reject', ['reason' => 'no'])->assertStatus(422)->assertJsonValidationErrors('reason');
    $this->postJson('records/1/reject', ['reason' => 'Duplicate of #12'])->assertOk()->assertJson(['reason' => 'Duplicate of #12']);
});

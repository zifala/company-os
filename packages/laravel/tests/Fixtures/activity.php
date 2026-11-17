<?php

declare(strict_types=1);

namespace CompanyOs\Audit;

use CompanyOs\Tests\Fixtures\FakeActivity;

/*
 * Stand-in for spatie's global activity() helper, declared in the logger's own
 * namespace so only SpatieAuditLogger resolves it. The global function stays
 * undefined, so the provider's function_exists('activity') check is unaffected.
 */
function activity(): FakeActivity
{
    return FakeActivity::$last = new FakeActivity;
}

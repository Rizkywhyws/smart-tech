<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DashboardUpdated implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        public string $type,
        public array $data = [],
    ) {}

    public function broadcastOn(): array
    {
        return [new Channel('landing')];
    }

    public function broadcastAs(): string
    {
        return 'dashboard.updated';
    }
}
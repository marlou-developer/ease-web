<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class PosStockUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public int $posStoreId;

    /** @var array<int, array{id: int, stocks: int}> */
    public array $stocks;

    public function __construct(int $posStoreId, array $stocks)
    {
        $this->posStoreId = $posStoreId;
        $this->stocks = $stocks;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('pos-store.' . $this->posStoreId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'stock.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'stocks' => $this->stocks,
        ];
    }
}

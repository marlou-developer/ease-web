<?php

namespace App\Events;

use App\Models\POS\PosSale;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class PosSaleCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public PosSale $sale;

    public function __construct(PosSale $sale)
    {
        $this->sale = $sale;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('pos-store.' . $this->sale->pos_store_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'sale.created';
    }

    public function broadcastWith(): array
    {
        return [
            'sale' => $this->sale,
        ];
    }
}

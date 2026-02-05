<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            // COFFEE
            ['name' => 'ESPRESSO', 'category' => 'COFFEE', 'price' => 15, 'desc' => 'Intense and aromatic single shot', 'stock' => 100, 'img' => '/assets/espresso.jpg'],
            ['name' => 'AMERICANO', 'category' => 'COFFEE', 'price' => 18, 'desc' => 'Smooth long black coffee', 'stock' => 100, 'img' => '/assets/americano.jpg'],
            ['name' => 'CAPPUCCINO', 'category' => 'COFFEE', 'price' => 25, 'desc' => 'Equal parts espresso, milk & foam', 'stock' => 100, 'img' => '/assets/cappuccino.jpg'],
            ['name' => 'LATTE', 'category' => 'COFFEE', 'price' => 28, 'desc' => 'Espresso with steamed milk', 'stock' => 100, 'img' => '/assets/latte.jpg'],
            ['name' => 'ICED AMERICANO', 'category' => 'COFFEE', 'price' => 20, 'desc' => 'Espresso diluted with hot water', 'stock' => 100, 'img' => '/assets/iced americcano.jpg'],
            ['name' => 'MOCHA', 'category' => 'COFFEE', 'price' => 30, 'desc' => 'Espresso with chocolate and milk', 'stock' => 100, 'img' => '/assets/mocha.jpg'],

            // COLD
            ['name' => 'JUICES', 'category' => 'COLD', 'price' => 25, 'desc' => 'Freshly squeezed seasonal fruits', 'stock' => 100, 'img' => '/assets/juice.jpg'],
            ['name' => 'MINERAL WATERS', 'category' => 'COLD', 'price' => 10, 'desc' => 'Chilled natural mineral water', 'stock' => 100, 'img' => '/assets/mineral water.jpg'],

            // TEAS
            ['name' => 'TEAS', 'category' => 'TEAS', 'price' => 15, 'desc' => 'Premium green or black tea selection', 'stock' => 100, 'img' => '/assets/teas.jpg'],

            // BAKERY
            ['name' => 'CLASSIC CROISSANT', 'category' => 'BAKERY', 'price' => 15, 'desc' => 'Buttery and flaky classic croissant', 'stock' => 100, 'img' => '/assets/croissant.png'],
            ['name' => 'ALMOND CROISSANT', 'category' => 'BAKERY', 'price' => 20, 'desc' => 'Filled with almond cream and topped with flakes', 'stock' => 100, 'img' => '/assets/ALMOND CROISSANT.jpg'],
            ['name' => 'CHOCOLATE CROISSANT', 'category' => 'BAKERY', 'price' => 18, 'desc' => 'French pastry with chocolate filling', 'stock' => 100, 'img' => '/assets/CHOCOLATE CROISSANT.jpg'],
            ['name' => 'CHOCOLATE MUFFINS', 'category' => 'BAKERY', 'price' => 22, 'desc' => 'Rich chocolate muffins with chips', 'stock' => 100, 'img' => '/assets/chocolate muffins.jpg'],
            ['name' => 'BLUEBERRY MUFFINS', 'category' => 'BAKERY', 'price' => 20, 'desc' => 'Fresh blueberry muffins', 'stock' => 100, 'img' => '/assets/BLUEBERRY MUFFINS.jpg'],
            ['name' => 'Waffles', 'category' => 'BAKERY', 'price' => 25, 'desc' => 'Delicious warm waffles', 'stock' => 100, 'img' => '/assets/Waffles.jpg'],
        ];

        foreach ($products as $productData) {
            Product::updateOrCreate(
                ['name' => $productData['name']],
                $productData
            );
        }
    }
}

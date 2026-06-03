<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Routes & Vite -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/pages/{$page['component']}.jsx"])
    <!-- DigitalPersona Web SDK -->
    <!-- <script src="/websdk/websdk.client.bundle.min.js"></script>
    <script src="/websdk/WebSdk.js"></script> -->

    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
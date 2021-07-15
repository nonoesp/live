<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Nono.MA Live</title>

        <style>
            html {
                font-family: system-ui;
                font-size: 1.5rem;
                --wrap-width: 30rem;
            }

            body {
                padding: 2.5rem;
            }

            .header {
                max-width: var(--wrap-width);
                margin: 0 auto;
                margin-bottom: 1.5rem;
            }

            .container {
                font-size: 0.7rem;
                max-width: var(--wrap-width);
                margin: 0 auto;

                display: flex;
                flex-wrap: wrap;
            }

            .container__item {
                flex-basis: 28%;
                min-height: 4rem;
                border-radius: 3px;
                margin-bottom: 1rem;
                background-color: rgba(0,150,150,0.25);
            }

            .container__item-content {
                padding: 0.5rem;
            }

            .container__item-title {
                font-weight: 600;
            }

            .container__item-body {
                color: rgba(0,0,0,0.7);
            }

            .container:not(.list) .container__item:not(:nth-of-type(3n)) {
                margin-right: 8%;
            }

            .container.list .container__item {
                flex-basis: 100%;
                margin-right: 0;
                min-height: 2rem;
            }

            .container__item:nth-of-type(2n) {
                transform: scale(0.9);
                /* opacity: 0.5; */
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="header">
            Nono.MA Live · Flex Grids
        </div>

        <div class="container -list">

            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>
            <div class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        Title
                    </div>
                    <div class="container__item-body">
                        Body text.
                    </div>
                </div>
            </div>

        </div>

    </body>
</html>

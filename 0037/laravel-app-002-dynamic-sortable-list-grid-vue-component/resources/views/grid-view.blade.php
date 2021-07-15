<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Nono.MA Live</title>

        <!-- JavaScript libraries -->
        <script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        
        <style>
            html {
                font-family: system-ui;
                font-size: 1.5rem;
                --wrap-width: 30rem;
            }

            body {
                padding: 1rem;
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
                margin-bottom: 0.4rem;
                background-color: rgb(93, 61, 188);
            }

            .container__item-content {
                padding: 0.5rem;
            }

            .container__item-title {
                font-weight: 600;
                color: #fff;
            }

            .container__item-body {
                color: rgba(255,255,255,0.7);
            }

            .container:not(.list) .container__item:not(:nth-of-type(3n)) {
                margin-right: 8%;
            }

            .container.list .container__item {
                flex-basis: 100%;
                margin-right: 0;
                min-height: 2rem;
            }

            [v-cloak] > * {
                display: none;
                /* opacity: 0.5; */
            }

            [v-cloak]::before {
                content: "Loading..";
                opacity: 0.6;
            }

            .container__header {
                display: flex;
                max-width: var(--wrap-width);
                margin: 0 auto;
            }

            .container__header-item {
                padding: 0.3rem;
                border: 2px solid rgb(93, 61, 188);;
                border-radius: 3px;
                margin-right: 0.3rem;
                margin-bottom: 0.3rem;
                cursor: pointer;
                user-select: none;
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="js--app">

            <div class="container__header">
                <div class="container__header-item"
                @click="sort('id')">
                    Id<span v-html="sortArrow('id')"></span>
                </div>
                <div class="container__header-item"
                @click="sort('name')">
                    Name<span v-html="sortArrow('name')"></span>
                </div>
                <div class="container__header-item"
                @click="sort('text')">
                    Text<span v-html="sortArrow('text')"></span>
                </div>
                <div class="container__header-item"
                @click="toggleMode">
                    <span v-html="mode == 0 ? `List` : `Grid`"></span>
                </div>
            </div>


        <div v-cloak class="
            js--app
            container"
            v-bind:class="{list: mode == 0}">

            <div v-for="sketch in sortedSketches" :key="sketch.id"
                class="container__item">
                <div class="container__item-content">
                    <div class="container__item-title">
                        @{{ sketch.name }}
                    </div>
                    <div class="container__item-body">
                        @{{ sketch.text }}
                        <span style="opacity:0.25;">@{{ sketch.id }}</span>
                    </div>
                </div>                
            </div>

        </div>
        </div>

        <script>

            let app;

            // setTimeout(() => {
                app = new Vue({
                    el: '.js--app',
                    data: {
                        sketches: [
                            {id: 3, name: 'Energy and time', text: '1000 words!'},
                            {id: 0, name: 'One word per day', text: '0200 words a day.'},
                            {id: 2, name: 'My journals', text: '0012 letters.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 1, name: 'We need new interfaces', text: '0009 Creatives interfaces.'},
                            {id: 4, name: 'Freediving: First impressions', text: '9999 What we learned.'}
                        ],
                        sortBy: ['id'],
                        orderBy: ['asc'],
                        mode: 0 // 0 for list, 1 for grid
                    },
                    computed: {
                        sortedSketches: function() {
                            return _.orderBy(
                                this.sketches,
                                this.sortBy,
                                this.orderBy
                            );
                        }
                    },
                    methods: {
                        toggleMode: function() {
                            this.mode = !this.mode;
                        },
                        sort: function(sortBy) {
                            if (this.orderBy[0] != 'asc' ||
                            this.sortBy != sortBy) {
                                this.sortBy = sortBy;
                                this.orderBy = ['asc'];
                            } else {
                                this.orderBy = ['desc'];
                            }
                            this.$forceUpdate();
                        },
                        sortArrow: function(sortBy) {
                            if (this.sortBy != sortBy) {
                                return ``;
                            } else if (this.orderBy[0] == 'asc') {
                                // Ascending
                                return ` ↑`;
                            }
                            // Descending
                            return ` ↓`;
                        }
                    }
                });
            // }, 250);

        </script>

    </body>
</html>

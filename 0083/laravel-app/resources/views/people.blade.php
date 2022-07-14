@extends('layout')

@php
    $names = [
        'Joan',
        'Isaac',
        'Nono',
        'Laura',
        'James',
        'Lily',
    ];
    $title = 'People';
@endphp

@section('content')
<p>Whatever I put inside, will show in the layout.
    Inside of the content div.</p>
<p>Go back <a href="/">Home</a>.</p>
@stop
{{-- @if(count($names) > 5)
<p>There's a lot of people.</p>
@else
<p>There's not that many people.</p>
@endif

@foreach ($names as $name)
<p>{{ $name }}</p>
@endforeach --}}
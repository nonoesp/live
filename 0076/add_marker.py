# Python 3.9
# script.py
#!/usr/bin/env python
# coding: utf-8
import argparse
import os
import math
from glob import glob

def elapsed_seconds_since_start(path):
   return os.path.getmtime(path)-os.stat(path).st_birthtime

def duration_seconds_to_hours_minutes_seconds(seconds):
    hours = math.floor(seconds / (60*60))
    minutes = math.floor(seconds / 60 % 60)
    seconds = math.ceil(seconds % 60)
    return (hours, minutes, seconds)

def seconds_to_timestamp(hours, minutes, seconds):
    hours_string = str(hours).zfill(2)
    minutes_string = str(minutes).zfill(2)
    seconds_string = str(seconds).zfill(2)
    if hours == 0:
        return f'{minutes_string}:{seconds_string}'
    return f'{hours_string}:{minutes_string}:{seconds_string}'

def timestamp(path):
    seconds = elapsed_seconds_since_start(path)
    hours, minutes, seconds = duration_seconds_to_hours_minutes_seconds(seconds)
    return seconds_to_timestamp(hours, minutes, seconds)

def add_marker(text, recording_path = None, recording_dir = None):

    if recording_path is None:

        file_types = [
            'mov',
            'MOV',
            'mp4',
            'MP4',
            'mkv',
            'MKV',
            'aiff',
            'AIFF',
            'mp3',
            'MP3',
            'wav',
            'WAV',
        ]
        # types = ('*.pdf', '*.cpp') # the tuple of file types
        recording_paths = []
        for file_type in file_types:
            recording_paths.extend(glob(f'{recording_dir}/*.{file_type}'))

        most_recent_modification_date = 0
        for file_path in recording_paths:
            modification_date = os.path.getmtime(file_path)
            if (modification_date > most_recent_modification_date):
                most_recent_modification_date = modification_date
                recording_path = file_path

    log_path = f'{recording_path}.markers.txt'

    with open(log_path, 'a') as f:
        stamp = timestamp(recording_path)
        marker_text = f'{stamp} - {text}\n'
        f.write(marker_text)

    recording_name = os.path.basename(recording_path)
    print(f'Created marker for {recording_name}')
    print(marker_text)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Create a marker for an ongoing recording.')
    parser.add_argument(
        '-t',
        '--text',
        type=str,
        default='Marker',
        help='Marker text.',
    )
    parser.add_argument(
        '-d',
        '--directory',
        type=str,
        default='/Users/nono/Dropbox/0_Inbox/recordings-hijack',
        help='Directory containing recordings.',
    )
    parser.add_argument(
        '-f',
        '--file',
        type=str,
        default=None,
        help='Path to recording file.',
    )

    opt = parser.parse_args()
    add_marker(opt.text, opt.file, opt.directory)
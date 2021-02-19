# Live 20

Thursday, February 18, 2021

## Creating a Docker image

- `-t` · {name}:{tag}
- `.` · Current directory

```
docker build -t live-20:tulips .
```

## Creating a Docker container

How to start a Docker container forwarding ports and removing after we're done.

- `-p` · Forwarding {host-machine}:{docker-machine}
- `--rm` · Remove container after we stop the process
- `live-20` · Name of image we want to run

```
docker run --rm -p 3000:8000 live-20
```

## Tag Image

```
docker tag live-20 nonoesp/pix2pix-live-20:tulips
```

## Push Image to Docker Hub

```
docker push nonoesp/pix2pix-live-20:tulips
```

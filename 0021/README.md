## CVAT on DigitalOcean

- Created a droplet with the Docker template
- Clone openvinotoolkit/cvat

```
git clone https://github.com/opencv/cvat
cd cvat
```

- Start Docker containers

```
docker-compose up -d
```

- Create admin user

```
docker exec -it cvat bash -ic 'python3 ~/manage.py createsuperuser'
```

- To make the `cvat_ui` accessible from DigitalOcean's public ipv4.

```
cvat_proxy:
    environment:
      CVAT_HOST: 139.59.186.122
```

- Optionally, you can serve on default port `80`

```
cvat_proxy:
    ports:
      - '80:80'
```
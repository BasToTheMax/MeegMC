docker run -it -d --rm --name RetMC -p 25566:25565 -v "$PWD":/usr/src/app -w /usr/src/app node:18 node .
docker attach RetMC
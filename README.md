![android-chrome-192x192.png](NerdyWeirdWords/public/android-chrome-192x192.png)

# /nerdy|weird|words/

A place where writers share their work with beta readers, gather feedback, and engage with them.

Still in development. Open source. Here you can find the code and roadmap.

The name, the slogan, and their stylization are inspired by regular expressions, a tool software developers use to match patterns in text. I was playing with a pattern that could match both *weird* and *words*, and, being the nerd I am, I threw that into the mix too.

The logo represents two brain halves—the right one flipped upside down—both resembling clouds, because this space thrives on imagination and lives in the cloud.

I created this because I’ve recently published my first novel, and I want to share it with beta readers in a meaningful, interactive way. And no existing platform felt quite right.

Nerdy Weird Words was featured in the JetBrains blog article [5 Stories Of Developers Using JetBrains Rider to Create, Collaborate, and Have Fun](https://blog.jetbrains.com/dotnet/2025/12/03/5-stories-of-developers-using-jetbrains-rider/).

## Roadmap

Currently working on version 1.2 – people upload writings

### Version 1

1. ~~People sign in~~
1. People upload writings
1. People invite people to beta read their writings → they have never signed up before
1. People accept invitations
1. People read writings
1. People comment on writings
1. People comment on paragraphs
1. Writers may enable public comments → they become visible to all the invited readers
1. If writers enabled public comments, readers may mark their comments as private (visible to the writer only) or public (visible to all the invited readers)
1. Writers and readers engage in threads of comments

### Version 2

1. People sign up
1. People edit their profiles
1. People comment on selected text
1. Writers may mark their writings as public → writers provide Kickstarter-like introductory material
1. People browse and search for public writings
1. People apply as readers for public writings
1. Writers approve readers

### Version 3

1. The system tracks engagement in terms of reading time, comment frequency, and the like (reputation indicator)
1. Writers rate readers
1. People report comments, people, writings
1. Admins ban people

## Development environment setup

Follow these steps to set up and run a development environment.

Generate a certificate using the following command. This will be used by the backend to sign tokens.

```
openssl genpkey -algorithm RSA -out ./NerdyWeirdWordsBackend/cert.pem -pkeyopt rsa_keygen_bits:2048
```

Spin up all required containers: database, backend, and frontend.

```
make watch
```

Once the containers are running, verify the backend is responding. This command will also initialize the database.

```
curl http://localhost:65535/status
```

Insert the first user into the database. Replace my email and name with your own.

```
docker exec nerdy-weird-database \
  mariadb -h 127.0.0.1 -u nerdyweirdwords -pnerdyweirdwords nerdyweirdwords \
  -e "insert into Person values ('1c6ea2a0-3b70-4b01-bc27-97c45294d3f2', 'fabio@nerdyweirdwords.com', 'Fabio', 'Scagliola');"
```

Point your browser to http://localhost:65534

In development, email delivery is disabled, so no link will be sent. Instead, it will be printed in the backend logs.

```
docker logs --follow nerdy-weird-backend
```


![android-chrome-192x192.png](NerdyWeirdWords/public/android-chrome-192x192.png)

# /nerdy|weird|words/

A place where writers share their work with beta readers, gather feedback, and engage with them.

Still in development. Open source. Here you can find the code and roadmap.

The name, the slogan, and their stylization are inspired by regular expressions, a tool software developers use to match patterns in text. I was playing with a pattern that could match both *weird* and *words*, and, being the nerd I am, I threw that into the mix too.

The logo represents two brain halves—the right one flipped upside down—both resembling clouds, because this space thrives on imagination and lives in the cloud.

I created this because I’m about to finish my first novella, and I want to share it with beta readers in a meaningful, interactive way. And no existing platform felt quite right.

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

## Setup

Take the following steps before you `make up` a local development environment.

Generate a self-signed certificate using the following command. This will be used by the backend to sign tokens.

```
openssl genpkey -algorithm RSA -out cert.pem -pkeyopt rsa_keygen_bits:2048
```

Insert the first user into the database using the following command. Replace my email and name with your own.

```
docker exec nerdy-weird-database \
  mariadb -h 127.0.0.1 -u nerdyweirdwords -pnerdyweirdwords nerdyweirdwords \
  -e "insert into Person values ('1c6ea2a0-3b70-4b01-bc27-97c45294d3f2', 'fabio@nerdyweirdwords.com', 'Fabio', 'Scagliola');"
```

TwilioSendGridApiKey
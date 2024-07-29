# CTF-Platform V2

## Description
- ICEWALL CTF Platform V2 using `nestjs`
- Database : `MongoDB` (Atlas)
- Cache + Session : `Redis` (Redis Cloud)

## Schema (Using `mongoose`)

### Account
- `id` : `ObjectId`
- `username` : `String`
- `password` : `String`
- `email` : `String`
- `role` : `String`

### Contest
- `id` : `ObjectId`
- `name` : `String`
- `description` : `String`
- `start` : `Date`
- `end` : `Date`
- `problems` : ManyToMany(`Problem`)
- `participants` : ManyToMany(`Account`)

### Problem
- `id` : `ObjectId`
- `name` : `String`
- `description` : `String`
- `flag` : `String`
- `score` : `Number`
- `url` : `String`
- `port` : `Number`
- `domain` : `String`


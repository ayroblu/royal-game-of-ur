The Royal Game of Ur
=====================

I saw this on youtube recently and wanted to make a basic implementation

* [YouTube link: Tom Scott vs Irving Finkel: The Royal Game of Ur | PLAYTHROUGH | International Tabletop Day 2017](https://www.youtube.com/watch?v=WZskjLq040I)

Installation
------------
Just run the following command:
```bash
docker-compose up
```

Help
----
### Docker Compose
Of note, the database is held by docker, you may want to setup a replication to somewhere else

```bash
docker-compose up # -d for daemon, --build if you make a change
docker-compose down
docker volume rm example_dbdata

# Inspect
docker volume ls
docker volume inspect example_dbdata
docker ps
docker-compose ps
docker images
docker-compose rm -f

## Clear all
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)
# Delete all volumes
docker volume rm $(docker volume ls -q)

# Shell Access
docker-machine ssh default
docker exec -it my-app-container bash
```

### NodeJS Express 
Just a note here that 
* req.query = querystring
* req.params = rest params in /user/:id
* req.body = post options
* req.get(headerName) = for headers

Use req.method to distinguish

### Postgres Conventions
> Based on: http://stackoverflow.com/questions/338156/table-naming-dilemma-singular-vs-plural-names
> http://stackoverflow.com/questions/2878248/postgresql-naming-conventions

1. Table names, column names are lowercase, with underscores
2. Always use singlar names (user instead of users)
3. ALL SQL is capitalised (SELECT, INSERT etc)

Required columns: when_updated and when_added - uses a trigger to update

When no clear unique id is clear for a table, use a uuid, preferably
```
CREATE EXTENSION "uuid-ossp";
SELECT uuid_generate_v1mc()
-- or -worse because disk frag, but actually random
CREATE EXTENSION pgcrypto;
SELECT gen_random_uuid()
```

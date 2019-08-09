-- This assumes that "createdb survey" has already been run.

drop table if exists dog;
drop table if exists person;
drop table if exists family;
drop table if exists address;

create table address (
  id serial primary key,
  street text,
  city text,
  state text,
  zip text
);

create table family (
  id serial primary key,
  addressId integer references address(id)
);

create table dog (
  id serial primary key,
  breed text,
  name text,
  familyId integer references family(id)
);

create table person (
  id serial primary key,
  name text,
  birthdate date,
  familyId integer references family(id)
);

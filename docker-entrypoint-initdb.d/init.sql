create database if not exists nerdyweirdwords;
create user if not exists nerdyweirdwords@'%' identified by 'nerdyweirdwords';
grant all on nerdyweirdwords.* to nerdyweirdwords@'%';


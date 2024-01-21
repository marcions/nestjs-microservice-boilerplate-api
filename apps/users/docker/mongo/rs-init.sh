#!/bin/bash

mongo <<EOF
ddb = db.getSiblingDB('db')

db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'db' }],
});
EOF

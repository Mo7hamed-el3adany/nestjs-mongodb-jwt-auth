mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var admin = db.getSiblingDB('admin');
    admin.auth(
        $(_js_escape "$MONGO_INITDB_ROOT_USERNAME"),
        $(_js_escape "$MONGO_INITDB_ROOT_PASSWORD")
    );

    db.createUser({
        user: $(_js_escape "$MONGO_DB_USER"),
        pwd: $(_js_escape "$MONGO_DB_PASSWORD"),
        roles: [
            {
                role: "readWrite",
                db: $(_js_escape "$MONGO_INITDB_DATABASE")
            }
        ]
    });
EOF

## Helpers

to delete all tables:
`php artisan tinker`

```lan=php
foreach(\DB::select('SHOW TABLES') as $table) {
    $table_array = get_object_vars($table);
    \Schema::drop($table_array[key($table_array)]);
}
```

## TODO

- dashboard widgets to show daily info
    - grab user's location and store it immediately
    - show user's location on dashboard
    - use react-tag-input for trigger foods list
- page for migrainelog

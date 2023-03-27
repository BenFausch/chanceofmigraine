
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

- widgets to show daily info
    - convert weather data to simple object, create a looper for component creation
- page for migrainelog

## Location History

A workaround the deprecation of the google location history api.

This submodule exports the google location history data of any user by accepting user auth credentials and running a selenium task to grab the zip contents.

Zip contents are then sent to a Mongo store. (of course, it is configurable to any preferred store)
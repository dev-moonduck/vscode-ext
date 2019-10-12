# What is this?

This is the extension to help your life with Hive/Spark SQL

## Features

### hiveconf resolver
You can replace all hive variable in your query.  

#### How to use
Select your query > `Cmd` + `shift` + `P` > Hiveconf resolver  
![demo](./static/images/demo.gif)

Also, you can validate your query.  
Your query must be valid, or you can see error below in your editor
- Case1) set query is not ended by semicolon.
![query validation](static/images/query_validation.png)
- Case2) Some values are missing.
![query validation](static/images/query_validation2.png)

So you can validate and resolve hiveconf

# Known issues

# Release notes
## 1.0.0
- Support hiveconf resolver
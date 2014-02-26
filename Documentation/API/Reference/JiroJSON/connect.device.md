JiroJSON / connect.device
====

###Request

| Name       | Type        | Description |
|:-----------|:------------|:------------|
| username   | string      | auth username
| password   | string      | auth password
| name       | string      | any name assigned to the mobile device
| model      | string      | the type of mobile device
| pin        | string      | any password used as verification for host connection


**Example**

```json
{
    "username": "JiroDocs",
    "password": "3GV6W72GHMBWWDQFVIW6AHCUJ269KD2TLQ95FDIY",
    "name": "Hunter's iPhone",
    "model": "iPhone",
    "pin": "1234"
}
```

<br/>
### Response

| Name           | Type        | Description |
|:---------------|:------------|:------------|
| access token   | string      | A private key that allows additional access to the service.
| socket token   | string      | A token that allows for the creation of a channel via the GAE Channel Service

**Example**

```json
{
    "stat": "ok",
    "tokens": {
        "access": "XEBJ25Y98KIRAAXUN9CDFQBUAB2NTT8KBTEHLXK2",
        "socket": "81BS0WCB807K842DBCCLKQJC1T7DDX8FK5MKSCOY"
    }
}
```
# architecture

## data model

### trip
  * tripid: UUID
  * title
  * start date
  * end date
  * list of stages

### stage
  * stageid: UUID
  * subtype: stay | travel

### stage: stay
  * title
  * location
  * timestampStart
  * timestampEnd

### stage: travel
  * title
  * locationStart
  * locationEnd
  * timestampStart
  * timestampEnd

### timestamp
  * datetime: in UTC, format: 'YYYY-MM-DD HH:mm', e.g. '2017-07-02 15:04'
  * timezone: name of the timezone e.g. 'Europe/Berlin'

### location
  * title
  * latitude
  * longitude
  * zoom

## URL schema
  * /trips
  * /trips/{tripid}
  * /trips/{tripid}/stages/{stageid}

## DB schema
  * /trip/{tripid}
  * /stage/{tripid}/{stageid}

import {GPTTokens} from 'gpt-tokens';
import NextCors from 'nextjs-cors';
import {MY_SECRET_KEY, APP_ID} from '@env';

/* DynamoDB reserved words... these can't be used for log events... 
ABORT
ABSOLUTE
ACTION
ADD
AFTER
AGENT
AGGREGATE
ALL
ALLOCATE
ALTER
ANALYZE
AND
ANY
ARCHIVE
ARE
ARRAY
AS
ASC
ASCII
ASENSITIVE
ASSERTION
ASYMMETRIC
AT
ATOMIC
ATTACH
ATTRIBUTE
AUTH
AUTHORIZATION
AUTHORIZE
AUTO
AVG
BACK
BACKUP
BASE
BATCH
BEFORE
BEGIN
BETWEEN
BIGINT
BINARY
BIT
BLOB
BLOCK
BOOLEAN
BOTH
BREADTH
BUCKET
BULK
BY
BYTE
CALL
CALLED
CALLING
CAPACITY
CASCADE
CASCADED
CASE
CAST
CATALOG
CHAR
CHARACTER
CHECK
CLASS
CLOB
CLOSE
CLUSTER
CLUSTERED
CLUSTERING
CLUSTERS
COALESCE
COLLATE
COLLATION
COLLECTION
COLUMN
COLUMNS
COMBINE
COMMENT
COMMIT
COMPACT
COMPILE
COMPRESS
CONDITION
CONFLICT
CONNECT
CONNECTION
CONSISTENCY
CONSISTENT
CONSTRAINT
CONSTRAINTS
CONSTRUCTOR
CONSUMED
CONTINUE
CONVERT
COPY
CORRESPONDING
COUNT
COUNTER
CREATE
CROSS
CUBE
CURRENT
CURSOR
CYCLE
DATA
DATABASE
DATE
DATETIME
DAY
DEALLOCATE
DEC
DECIMAL
DECLARE
DEFAULT
DEFERRABLE
DEFERRED
DEFINE
DEFINED
DEFINITION
DELETE
DELIMITED
DEPTH
DEREF
DESC
DESCRIBE
DESCRIPTOR
DETACH
DETERMINISTIC
DIAGNOSTICS
DIRECTORIES
DISABLE
DISCONNECT
DISTINCT
DISTRIBUTE
DO
DOMAIN
DOUBLE
DROP
DUMP
DURATION
DYNAMIC
EACH
ELEMENT
ELSE
ELSEIF
EMPTY
ENABLE
END
EQUAL
EQUALS
ERROR
ESCAPE
ESCAPED
EVAL
EVALUATE
EXCEEDED
EXCEPT
EXCEPTION
EXCEPTIONS
EXCLUSIVE
EXEC
EXECUTE
EXISTS
EXIT
EXPLAIN
EXPLODE
EXPORT
EXPRESSION
EXTENDED
EXTERNAL
EXTRACT
FAIL
FALSE
FAMILY
FETCH
FIELDS
FILE
FILTER
FILTERING
FINAL
FINISH
FIRST
FIXED
FLATTERN
FLOAT
FOR
FORCE
FOREIGN
FORMAT
FORWARD
FOUND
FREE
FROM
FULL
FUNCTION
FUNCTIONS
GENERAL
GENERATE
GET
GLOB
GLOBAL
GO
GOTO
GRANT
GREATER
GROUP
GROUPING
HANDLER
HASH
HAVE
HAVING
HEAP
HIDDEN
HOLD
HOUR
IDENTIFIED
IDENTITY
IF
IGNORE
IMMEDIATE
IMPORT
IN
INCLUDING
INCLUSIVE
INCREMENT
INCREMENTAL
INDEX
INDEXED
INDEXES
INDICATOR
INFINITE
INITIALLY
INLINE
INNER
INNTER
INOUT
INPUT
INSENSITIVE
INSERT
INSTEAD
INT
INTEGER
INTERSECT
INTERVAL
INTO
INVALIDATE
IS
ISOLATION
ITEM
ITEMS
ITERATE
JOIN
KEY
KEYS
LAG
LANGUAGE
LARGE
LAST
LATERAL
LEAD
LEADING
LEAVE
LEFT
LENGTH
LESS
LEVEL
LIKE
LIMIT
LIMITED
LINES
LIST
LOAD
LOCAL
LOCALTIME
LOCALTIMESTAMP
LOCATION
LOCATOR
LOCK
LOCKS
LOG
LOGED
LONG
LOOP
LOWER
MAP
MATCH
MATERIALIZED
MAX
MAXLEN
MEMBER
MERGE
METHOD
METRICS
MIN
MINUS
MINUTE
MISSING
MOD
MODE
MODIFIES
MODIFY
MODULE
MONTH
MULTI
MULTISET
NAME
NAMES
NATIONAL
NATURAL
NCHAR
NCLOB
NEW
NEXT
NO
NONE
NOT
NULL
NULLIF
NUMBER
NUMERIC
OBJECT
OF
OFFLINE
OFFSET
OLD
ON
ONLINE
ONLY
OPAQUE
OPEN
OPERATOR
OPTION
OR
ORDER
ORDINALITY
OTHER
OTHERS
OUT
OUTER
OUTPUT
OVER
OVERLAPS
OVERRIDE
OWNER
PAD
PARALLEL
PARAMETER
PARAMETERS
PARTIAL
PARTITION
PARTITIONED
PARTITIONS
PATH
PERCENT
PERCENTILE
PERMISSION
PERMISSIONS
PIPE
PIPELINED
PLAN
POOL
POSITION
PRECISION
PREPARE
PRESERVE
PRIMARY
PRIOR
PRIVATE
PRIVILEGES
PROCEDURE
PROCESSED
PROJECT
PROJECTION
PROPERTY
PROVISIONING
PUBLIC
PUT
QUERY
QUIT
QUORUM
RAISE
RANDOM
RANGE
RANK
RAW
READ
READS
REAL
REBUILD
RECORD
RECURSIVE
REDUCE
REF
REFERENCE
REFERENCES
REFERENCING
REGEXP
REGION
REINDEX
RELATIVE
RELEASE
REMAINDER
RENAME
REPEAT
REPLACE
REQUEST
RESET
RESIGNAL
RESOURCE
RESPONSE
RESTORE
RESTRICT
RESULT
RETURN
RETURNING
RETURNS
REVERSE
REVOKE
RIGHT
ROLE
ROLES
ROLLBACK
ROLLUP
ROUTINE
ROW
ROWS
RULE
RULES
SAMPLE
SATISFIES
SAVE
SAVEPOINT
SCAN
SCHEMA
SCOPE
SCROLL
SEARCH
SECOND
SECTION
SEGMENT
SEGMENTS
SELECT
SELF
SEMI
SENSITIVE
SEPARATE
SEQUENCE
SERIALIZABLE
SESSION
SET
SETS
SHARD
SHARE
SHARED
SHORT
SHOW
SIGNAL
SIMILAR
SIZE
SKEWED
SMALLINT
SNAPSHOT
SOME
SOURCE
SPACE
SPACES
SPARSE
SPECIFIC
SPECIFICTYPE
SPLIT
SQL
SQLCODE
SQLERROR
SQLEXCEPTION
SQLSTATE
SQLWARNING
START
STATE
STATIC
STATUS
STORAGE
STORE
STORED
STREAM
STRING
STRUCT
STYLE
SUB
SUBMULTISET
SUBPARTITION
SUBSTRING
SUBTYPE
SUM
SUPER
SYMMETRIC
SYNONYM
SYSTEM
TABLE
TABLESAMPLE
TEMP
TEMPORARY
TERMINATED
TEXT
THAN
THEN
THROUGHPUT
TIME
TIMESTAMP
TIMEZONE
TINYINT
TO
TOKEN
TOTAL
TOUCH
TRAILING
TRANSACTION
TRANSFORM
TRANSLATE
TRANSLATION
TREAT
TRIGGER
TRIM
TRUE
TRUNCATE
TTL
TUPLE
TYPE
UNDER
UNDO
UNION
UNIQUE
UNIT
UNKNOWN
UNLOGGED
UNNEST
UNPROCESSED
UNSIGNED
UNTIL
UPDATE
UPPER
URL
USAGE
USE
USER
USERS
USING
UUID
VACUUM
VALUE
VALUED
VALUES
VARCHAR
VARIABLE
VARIANCE
VARINT
VARYING
VIEW
VIEWS
VIRTUAL
VOID
WAIT
WHEN
WHENEVER
WHERE
WHILE
WINDOW
WITH
WITHIN
WITHOUT
WORK
WRAPPED
WRITE
YEAR
ZONE 

*/

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method !== 'POST') {
    //res.status(400).json({ error: 'Invalid method, only POST allowed!' });
    //return;
    return new Response(
      JSON.stringify({error: 'Invalid method, only POST allowed!'}),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const body = req.body;

  //  const body = await req.json();

  //const { session, question, messages: tokenMessages, llm, answer, score, tokens, currentIndex } = req.body;
  const {
    userId,
    requestId,
    followUp,
    aggregate,
    entryType,
    langCode,
    session,
    statement,
    llm,
    answer,
    score,
    tokens,
    currentIndex,
    finish_reason = null,
  } = body;
  //followUp: opts.followUp, aggregate: opts.aggregate,

  console.log('LOG UPDATE START ', new Date().toISOString());
  const logEvent = {
    [requestId]: {
      SESSION_ID: session,
      APP_ID: APP_ID,
      INDEX_ID: currentIndex,
      USER_ID: userId || 'XXXXXXXX',
    },
  };

  console.log(`###_SESSION_ID= ${session}`);
  console.log(`###_INDEX_ID= ${currentIndex}`);
  console.log(`###_REQUEST_ID= ${requestId}`);

  let usageInfo = undefined;
  if (typeof answer === 'undefined') {
    /* 
        usageInfo = new GPTTokens({
          model: llm,
          messages: tokenMessages.map(m => ({ "role": m.role, "content": m.content }))
        });
    
     */
    console.log(`###_INIT_STATEMENT= ${statement}`);

    console.log(`###_ENTRY_TYPE= ${entryType}`);
    console.log(`###_ENTRY_LANG= ${langCode}`);
    logEvent[requestId]['ENTRY_TYPE'] = entryType;
    logEvent[requestId]['ENTRY_LANG'] = langCode;
    // logEvent[requestId]["INIT_TOKENS"] = usageInfo.usedTokens;
    logEvent[requestId]['INIT_STATEMENT'] = statement;

    if (followUp) {
      console.log(`###_FOLLOWUP= OK`);
      logEvent[requestId]['FOLLOWUP'] = true;
    }
    if (aggregate) {
      console.log(`###_AGGREGATE= OK`);
      logEvent[requestId]['AGGREGATION'] = true;
    }
    //console.log(`###_APP_ID= ${process.env.NEXT_PUBLIC_USER_ID}`);
  }
  if (answer && answer.length > 0) {
    usageInfo = new GPTTokens({
      model: llm,
      messages: [{role: 'assistant', content: answer}],
    });
    // console.log(`###_APP_ID= ${process.env.NEXT_PUBLIC_USER_ID}`);
    // console.log(`###_SESSION_ID= ${session}`);
    console.log(`###_ANSWER_TOKENS=${usageInfo.usedTokens}`);
    console.log(`###_SCORE= ${score}`);
    console.log(`###_END_STATEMENT= ${statement}`);
    console.log(`###_ANSWER= ${answer}`);
    console.log(`###_TOTAL_TOKENS= ${tokens + usageInfo.usedTokens}`);

    logEvent[requestId]['ANSWER_TOKENS'] = usageInfo.usedTokens;
    logEvent[requestId]['SCORE'] = score;
    logEvent[requestId]['END_STATEMENT'] = statement;
    logEvent[requestId]['ANSWER'] = answer;
    logEvent[requestId]['TOTAL_TOKENS'] = tokens + usageInfo.usedTokens;
  }
  if (finish_reason) {
    console.log(`###_FINISH_REASON= ${finish_reason}`);
    logEvent[requestId]['FINISH_REASON'] = finish_reason;
    /*   if (finish_reason === 'length') {
        console.log(`###_FINISH= -1`);
      }
      if (finish_reason === 'function') {
        console.log(`###_FINISH= 2`);
      }
      if (finish_reason === 'stop') {
        console.log(`###_FINISH= 1`)
      } */
  }
  console.log('###_LOG_EVENT= ', JSON.stringify(logEvent));
  console.log('LOG UPDATE END ', new Date().toISOString());
  //res.status(200).json({ response: { tokens: usageInfo.usedTokens } });

  res.status(200).json({response: {tokens: usageInfo?.usedTokens || 0}});
  /* 
  return new Response(JSON.stringify({ response: { tokens: usageInfo?.usedTokens || 0 } }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  }) */
}

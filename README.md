
1. Define variables on ./src/source.json
  - URLs to test
  - output file name (w/ extension)
  - output directory (relative to source.json)
  - delay per test (needed to prevent stress on the server)

2. Run lighthouse 
```$ yarn run audit```

3. Once tests are done, open your browser on localhost:5000 to see results
```localhost:5000```
# libdatetime
A Date/Time library for the Browser.

## Install
```bash
npm install libdatetime
```

## Usage
```javascript
import { DateTime } from 'libdatetime';

const dt = new DateTime();

dt.addEventListener("second", (event) => {console.log(event)})
// { type: "second", detail: { current: Date, pervious: Date } }
```

## License

Licensed under the [MIT](LICENSE) License.

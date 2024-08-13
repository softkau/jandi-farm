'use client'

/* 챗지피티야 고마워 */
import { useState } from 'react';

const ApiTester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState('no response yet');
  const [isLoading, setIsLoading] = useState(false);
  const methodColor = {
    "GET": "from-lime-300 to-green-500",
    "POST": "from-pink-300 to-purple-600",
    "PUT": "from-cyan-200 to-blue-600",
    "PATCH": "from-cyan-200 to-blue-600",
    "DELETE": "from-orange-500 to-red-600"
  };

  const sendRequest = async () => {
    let options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // HTTP 헤더 세팅
    headers.forEach(header => {
      if (header.key && header.value) {
        options.headers[header.key] = header.value;
      }
    });

    // GET 이외 메소드면 body 설정
    if (method !== 'GET' && body) {
      options.body = body;
    }

    setIsLoading(true);

    // FETCH
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const json = await res.json();
        setResponse(JSON.stringify(json, undefined, 2));
      } else {
        const text = await res.text();
        setResponse(text);
      }
      
    } catch (error) {
      setResponse('Error: ' + error.message);
    }

    setIsLoading(false);
  };

  const handleHeaderChange = (index, key, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((arg, idx) => idx != index));
  }

  return (
    <div className="m-1 p-1 bg-slate-200 outline outline-2 outline-slate-500 rounded-sm">
      <h1 className="font-bold">API Tester</h1>
      <form
        className="p-1 bg-white rounded-lg relative"
        onSubmit={e => {
          e.preventDefault();
          sendRequest();
        }}
      >
        <label className="flex">
          <div className="font-bold">HTTP Method:&nbsp;</div>
          <select
            className={`outline outline-1 outline-slate-200 rounded-md
                       bg-gradient-to-t
                       ${methodColor[method]}
                       font-bold text-slate-800/80`}
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </label>
        <label>
          <div className='font-bold'>URL</div>
          <input
            className="bg-slate-100 rounded-md p-1"
            placeholder="http://localhost:3000/api/..."
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          <div className='font-bold'>HTTP Request Body (JSON)</div>
          <textarea
            className='bg-slate-100 rounded-md p-1'
            placeholder={`{
  key: value
}`}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', height: '100px' }}
          />
        </label>
        <br />
        {headers.map((header, index) => (
          <div key={index} className='rounded-full p-1 pl-4 pr-4 flex gap-4 mb-1 bg-slate-300'>
            Header
            <label className='flex flex-row w-1/6'>
              Key&nbsp;
              <input
                className="w-full rounded-md bg-slate-100 pl-1 pr-1"
                type="text"
                value={header.key}
                onChange={e =>
                  handleHeaderChange(index, e.target.value, header.value)
                }
              />
            </label>
            <label className='flex flex-row w-4/6'>
              Value&nbsp;
              <input
                className="w-full rounded-md bg-slate-100 pl-1 pr-1"
                type="text"
                value={header.value}
                onChange={e =>
                  handleHeaderChange(index, header.key, e.target.value)
                }
              />
            </label>
            <button
              type="button"
              className='rounded-md pl-2 pr-2 bg-red-600 font-bold text-white'
              onClick={ () => removeHeader(index) }>
              DELETE
            </button>
          </div>
        ))}
        <button
          type="button"
          className='rounded-lg pl-2 pr-2 ml-1 outline outline-2 outline-slate-200 bg-green-600 font-bold text-white'
          onClick={addHeader}
        >
          ADD HEADER
        </button>
        <br />
        <br />
        <button
          type="submit"
          className='absolute right-1 bottom-1 rounded-lg pl-2 pr-2 outline outline-2 outline-slate-200 bg-blue-600 font-bold text-white'
        >
          SUBMIT
        </button>
      </form>
      <h2 className='font-bold'>Response</h2>
      {isLoading ? <p>Loading...</p> : <pre className="p-1 bg-slate-300 rounded-lg">{response}</pre>}
    </div>
  );
};

export default ApiTester;
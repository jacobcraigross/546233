ssh {user}@{host} --> root@168.98.145.66 (mock IPv4 address) 

----------

Three keys to performance. (FE <-----> NETWORK <-----> BE)

FE --> Critical render path, optimized code, PWA solution. 

NETWORK (latency over the wire) --> minimize files, minimize delivery. 

BE --> CDNs, caching, load balancing, DB scaling, Gzip. 

----------

Webpack will build our code into small minified packages. 
For images, choose the right compressions and file type for the job. 
In general try to avoid highly detailed, complex illustrations with lots of color. 
remove image meta data. also a CDN like imgix can help. 
knowing the medium in which the content will be consumed and optimize for that. --> (media queries) 

@media screen and (min-width: 900px) {
  body {
    background: url('./large-background.jpg') no-repeat center center fixed;
    background-size: cover;
  }
}

----------

Bootstrap and JQuery --> heavy bloat. think twice before using them. 
instead of Bootstrap use flexbox / css grid. they are native!
instead of JQuery use modern vanilla JS. 
Element selection is very easy now with querySelector() and querySelectorAll() etc. 
Event binding is easy with addEventListener(), classList() etc. 

Browsers have limits on how many "trips" they can make or files they can download concurrently from one domain. 

In general, go lightweight, limit the amount of files and photos. 













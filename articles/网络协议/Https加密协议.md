请求加密有两种方式，一种是**对称加密**，一种是**非对称加密**。

对称加密算法中，加密和解密使用的秘钥是一样的。所以，秘钥要保护好，不能对外公开。

非对称加密算法中，加密和解密使用的秘钥是不一样的。一把是公钥，一把是秘钥。公钥加密的信息只能私钥解密，私钥加密的信息只能公钥解密。

## 对称加密

要使用对称加密，必须让双方都知道秘钥，如果让双方都知道呢？在线上传输有可能被黑客窃取，那只能采取线下对接的方式了。很明显在互联网应用中这样是不行的。

但是对称加密相对于非对称加密来说，效率要高很多，性能也好，所以交互的场景下多用对称加密。

## 非对称加密

非对称加密的私钥存放在服务端，不会在互联网上传输，对应的公钥是可以在互联网上传播的。

那如果服务器用私钥发送内容的话，还是很容易被黑客用公钥解密的。所以，一堆公钥私钥是不够的，客户端和服务端都需要有自己的公钥和私钥。

## 数字证书

如何将不对称加密的公钥给对方呢？一种是放在公网地址上让对方下载，一种是在建立连接的时候传给对方。

那如果鉴别别人给你的公钥是对的？那就需要由权威部分颁发的证书，证书里面有公钥，还有所有者、发布机构、签名算法和证书有效期。这个权威机构我们称为**CA（Certificate Authority）**。

那如何验证 CA 的证书是对的呢？那我们拿着 CA 的公钥去向他的上级证书颁发机构确认，直到全球统一的根证书颁发机构 root CA 确认了，我们才认可。通过这种**层层授信背书**的方式，保证非对称加密模式的正常运转。

这个证书一般是在操作系统安装时自带的，所以如果你安装了非正规渠道的操作系统，很可能让你的电脑在网络世界里裸奔。

## HTTPS 的工作模式

![img](https://static001.geekbang.org/resource/image/10/7e/10315ffa19492462cadfbdfb3113987e.jpg)

- 客户端发送 Client Hello 消息给服务端，以明文传输 TLS 版本信息、加密套件候选列表、压缩算法候选列表等信息。同时生成一个随机数发送过去，在协商对称秘钥的时候使用。
- 服务端接收到消息后，发送 Server Hello 消息给客户端，告诉客户端服务端选择的协议版本、加密套件、压缩算法等。也生成一个随机数发送过去，在协商对称秘钥的时候使用。
- 服务端会再发送服务端证书给客户端，然后发送 Server Hello Done 消息给客户端，告诉客户端要准备的信息都传输好了。
- 客户端拿到证书后，当然要去校验一下这个证书。校验完成之后，说明这个服务端是可信的，然后会把自己的证书发送给服务端校验。然后客户端产生一段随机数字 Pre-master，用服务端发送过来的公钥进行加密，发送 Client Key Exchange 消息给服务端。
- 然后客户端和服务端都有自己一开始生成的随机数、对方生成然后发送过来的随机数、对方通过公钥加密的 Pre-master 随机数然后我方解密，总共这三个随机数，然后就可以产生在服务端和客户端相同的对称秘钥了。
- 生成对称加密秘钥之后，客户端发送 Change Cipher Spec 消息给服务端，通知服务端以后可以采用协商的通信秘钥和加密算法进行加密通信了
- 然后会再发送一个 Encrypted Handshake Message 消息，将已经商定好的参数，采用协商秘钥进行加密，发送给服务端用于数据与握手验证
- 服务端接收到信息，返回给客户端 Change Cipher Sepc 消息，确定没问题。然后也发送一条 Encrypted Handshake Message 消息回去。当双方握手结束之后，就可以通过对称加密进行加密传输了。




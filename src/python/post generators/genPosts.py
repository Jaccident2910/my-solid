def gen_combo(comboNum, captionString):
    return(f"""@prefix schema: <https://schema.org/>.

<https://jaccident3.solidcommunity.net/public/posts#combo{comboNum}>
  schema:caption "{comboNum}: {captionString}";
  schema:image <https://jaccident3.solidcommunity.net/public/images/combo{comboNum}.jpg>;
  schema:contentURL <https://jaccident3.solidcommunity.net/public/articles/combo{comboNum}.txt>;
  a schema:CreativeWork.
""")

def gen_typeless_combo(comboNum, captionString):
    return(f"""@prefix schema: <https://schema.org/>.

<https://jaccident3.solidcommunity.net/public/posts#typelessCombo{comboNum}>
  schema:caption "{comboNum}: {captionString}";
  schema:image <https://jaccident3.solidcommunity.net/public/images/typeless_combo{comboNum}.jpg>;
  schema:contentURL <https://jaccident3.solidcommunity.net/public/articles/typeless_combo{comboNum}.txt>.
""")

def gen_article(articleNum, description):
    return(f"""@prefix schema: <https://schema.org/>.

<https://jaccident3.solidcommunity.net/public/posts#article{articleNum}>
  schema:description "{articleNum}: {description}";
  schema:contentURL <https://jaccident3.solidcommunity.net/public/articles/article{articleNum}.txt>;
  a schema:BlogPosting.
""")

def gen_typeless_article(articleNum, description):
    return(f"""@prefix schema: <https://schema.org/>.

<https://jaccident3.solidcommunity.net/public/posts#typelessArticle{articleNum}>
  schema:description "{articleNum}: {description}";
  schema:contentURL <https://jaccident3.solidcommunity.net/public/articles/typeless_article{articleNum}.txt>.
""")


def gen_textpost(postNum, text):
    return(f"""@prefix schema: <https://schema.org/>.

<https://jaccident3.solidcommunity.net/public/posts#text{postNum}>
  schema:text "{postNum}: {text}";
  a schema:TextObject.
""")

oldfileContents = f"""This is a file of number i that is the text component of the combo for that number. Wahoo!!


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac nisi in leo sollicitudin pretium varius nec nisi. Fusce et bibendum dui, ut auctor nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis quis laoreet mauris, eu condimentum magna. Morbi aliquet nec mauris vitae interdum. Mauris tortor dui, tincidunt sit amet tempor quis, consequat eu sem. Pellentesque convallis sapien id eros vestibulum accumsan sit amet ut nisi. Integer vitae mi eget felis commodo bibendum quis a ipsum. Cras nec urna odio.

Cras ultrices lobortis venenatis. Pellentesque arcu tellus, malesuada convallis porttitor a, condimentum nec mauris. In justo elit, mollis sodales arcu ac, rhoncus pulvinar quam. Morbi nec egestas nunc, non efficitur erat. Nullam purus justo, consectetur quis tempor ut, imperdiet sit amet tellus. Vivamus vitae dictum libero. Vestibulum ante sem, rhoncus sit amet interdum sed, scelerisque vitae metus. Nunc ac est in dui volutpat iaculis sed quis sapien. Praesent mattis scelerisque scelerisque. Maecenas volutpat orci vitae dolor tincidunt consequat. Aenean vel blandit neque, at porta ante. Ut in nisl ligula. Etiam tincidunt sapien euismod porttitor tincidunt. Suspendisse lobortis, purus ac rhoncus porta, augue augue fringilla nisi, et blandit massa massa ac sapien.

Nullam sed odio nec tellus lobortis semper. Donec id ante ac eros ornare sodales. In feugiat libero pharetra, feugiat nulla nec, cursus metus. Aliquam placerat blandit tortor, vel consectetur ante mattis vel. Aenean tristique ex nec massa congue sodales. Morbi at nibh elit. Praesent eu ullamcorper sapien.

Nulla eu lacus tempor, lobortis nulla quis, consectetur sapien. Fusce dapibus purus sed luctus ultrices. Cras fermentum eleifend ligula, nec mollis enim efficitur quis. In id odio purus. Nam sollicitudin ipsum vel nunc bibendum molestie. Maecenas id feugiat ante. Mauris non pharetra enim. Maecenas tincidunt mauris in lacinia dapibus. Morbi malesuada scelerisque placerat. Proin aliquet ipsum quam, eu aliquet libero volutpat sed. Donec feugiat auctor arcu eget eleifend.

Fusce posuere ex velit, nec scelerisque diam mollis efficitur. Suspendisse et bibendum urna. Aenean volutpat tellus a nunc rhoncus pretium. Curabitur sodales interdum odio vitae mattis. Nulla eu erat purus. Nulla interdum viverra eros vitae congue. Etiam egestas, quam eget suscipit faucibus, turpis lectus iaculis orci, volutpat lacinia tortor sem at arcu. In commodo, erat nec sagittis lobortis, tellus nisi accumsan magna, in ullamcorper purus mauris vel arcu. Integer sed nulla id ex tincidunt blandit id vel libero. Etiam id ex faucibus, bibendum mi quis, suscipit nibh. Vivamus imperdiet, lectus a mollis pellentesque, erat neque egestas dolor, ac venenatis ipsum nibh a sapien. Integer aliquet sem in tellus lacinia, sit amet cursus nibh pretium. 
    """

numOfPosts = 10
for i in range(1, numOfPosts+1):
    fileName = f"typeless_combo{i}.ttl"
    fileContents = gen_typeless_combo(i, "This is a caption for a article post with no type annotations!")
    theFile = open(fileName, 'w+')
    theFile.write(fileContents)
    theFile.close()



#print(gen_combo(47, "YIPPEEEE!!!"))
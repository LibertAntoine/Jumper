import base64, sys

code = base64.b64decode(sys.argv[1]).decode("utf-8")
namespace = {}
exec(code, namespace)
namespace["run"]()


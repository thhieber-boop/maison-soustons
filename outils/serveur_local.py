"""
Petit serveur pour voir le site sur ce Mac, à l'adresse http://localhost:8090
Il interdit au navigateur de garder d'anciennes versions des pages.
Se lance avec « Voir le site.command » (dossier Site internet).
"""
import functools, http.server, os


class SansMemoire(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        for entete in ("If-Modified-Since", "If-None-Match"):
            if entete in self.headers:
                del self.headers[entete]
        return super().send_head()

    def log_message(self, *args):
        pass


dossier_site = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
gestionnaire = functools.partial(SansMemoire, directory=dossier_site)
http.server.ThreadingHTTPServer(("127.0.0.1", 8090), gestionnaire).serve_forever()

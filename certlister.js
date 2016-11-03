var {components, Cu, Cc, Ci} = require("chrome");

function getCerts() {
  let certDB = Cc["@mozilla.org/security/x509certdb;1"]
                    .getService(Ci.nsIX509CertDB);
  return certDB.getCerts();
}

function listCerts() {
  let allCerts = getCerts();
  let digests = [];
  let enumerator = allCerts.getEnumerator();
  while (enumerator.hasMoreElements()) {
    let cert = enumerator.getNext().QueryInterface(Ci.nsIX509Cert);
    digests[digests.length] = cert.sha256SubjectPublicKeyInfoDigest;
  }
  return digests;
}

exports.listCerts = listCerts;

exports.init = function () {
  dump("I can haz init??\n\n");
}

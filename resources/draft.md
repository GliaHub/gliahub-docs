evet, en doğru hamle bu. bütün sistemi tek seferde “büyük platform” gibi anlatmak yerine **sprint bazlı, her sprint sonunda demo edilebilir ürün** şeklinde bölmek lazım. yoksa yatırımcı/ekip/lab tarafında “bu çok büyük, nereden başlayacaklar?” hissi oluşur.

bunu 2 haftalık sprintlerle bölerdim. mvp odaklı ama tüm roadmap’i kapsayan plan şöyle olurdu:

ana prensip şu:

```text
her sprint sonunda çalışan bir demo olacak.
hiçbir sprint sadece “infra yaptık ama görünmüyor” sprinti olmayacak.
infra varsa bile kullanıcıya dokunan bir akışa bağlanacak.
```

ana demo akışı da baştan sabitlenmeli:

```text
raw eeg dataset
↓
load
↓
filter / notch / rereference
↓
epoch
↓
ica / artifact cleaning
↓
psd / bandpower
↓
html report
↓
workflow version + run history + artifacts
```

bu ürünün “golden path”i olur. her sprint bu path’i biraz daha gerçek, güvenli, paylaşılabilir ve satılabilir hale getirir.

raporlardaki roadmap zaten buna yakın: 0–3 ay prototype, 3–6 ay mvp pilots, 6–12 ay community repo, 12–18 ay lab product diye gidiyor; deck’te de local runner, visual editor, eeg nodes, html report, public templates, node sdk, private workspace, rbac, audit logs ve hosted execution beta sıralanmıştı. 

## faz 0 — hazırlık sprinti

**sprint 0: ürün kontratı ve demo dataset**

bu kod sprinti değil, ama çok önemli. burada tek bir “golden workflow” seçilir. örnek dataset, node listesi, workflow json spec v0, plugin manifest v0, run state machine ve demo senaryosu netleşir.

sprint sonunda demo şöyle olur:

```text
figma/prototype veya statik ui
+
örnek workflow json
+
örnek plugin manifest
+
örnek run output klasörü
```

burada amaç “ne yapıyoruz?” sorusunu kilitlemek. bu kilitlenmeden go api yazmaya başlamak erken olur.

## faz 1 — çalışan prototip: workflow çiz, kaydet, export et

**sprint 1: auth + workspace + project shell**

kapsam:

```text
user login
organization
workspace
project
basic navigation
postgres schema v0
```

demo:

```text
kullanıcı giriş yapar
kişisel workspace oluşturur
project açar
boş workflow editor ekranına gelir
```

burada kurumsal/bireysel ayrımı baştan veri modeline girer ama detaylı enterprise yok. bireysel kullanıcı tek kişilik organization gibi davranır.

**sprint 2: workflow editor v0**

kapsam:

```text
react flow canvas
node ekleme
edge bağlama
node params panel
save/load workflow draft
workflow json schema v0
```

demo:

```text
kullanıcı load → filter → report node’larını canvas’a koyar
parametre girer
workflow’u kaydeder
sayfayı yenileyince workflow geri gelir
```

teknik raporun react/next.js + react flow önerisi burada tam oturuyor; react flow node editor ergonomisi için doğru başlangıç olarak önerilmişti. 

**sprint 3: plugin manifest + statik eeg-core pack**

kapsam:

```text
plugin manifest json
node schema
input/output type sistemi
eeg-core static registry
node library sidebar
entitlement mock
```

demo:

```text
eeg planı açık olan workspace’te eeg node’ları görünür
cv node’u locked görünür
node seçilince schema’dan parametre formu oluşur
```

bu sprintte gerçek marketplace yok. sadece marketplace’in mimari tohumu var.

**sprint 4: python code export**

kapsam:

```text
workflow graph → python script export
basic mne import template
params injection
download/export
```

demo:

```text
kullanıcı görsel workflow’u python script olarak indirir
script localde çalıştırılabilir iskelet üretir
```

bu çok önemli çünkü ürün “locked no-code” gibi görünmemeli. deck’te de ürünün low-code kalması ama python export ile kullanıcıyı kilitlememesi vurgulanıyordu. 

## faz 2 — çalışan mvp execution: dataset yükle, docker’da çalıştır, çıktı gör

**sprint 5: object storage + dataset snapshot v0**

kapsam:

```text
minio/s3 adapter
small dataset upload
dataset object manifest
checksum
dataset snapshot record
artifact model v0
```

demo:

```text
kullanıcı küçük bir eeg dosyası yükler
sistem dataset snapshot oluşturur
dosya object storage’a gider
ui’da dataset card görünür
```

burada dosyalar postgres’e değil object storage’a gider. metadata, manifests ve run state postgres’te kalır. teknik rapor da raw/derived datasetlerin object storage’da, relational metadata/permissions/manifests/run state’in postgres’te durmasını öneriyor. 

**sprint 6: docker runner v0**

kapsam:

```text
go runner daemon
docker sdk
job table
run state machine
container start/stop
stdout/stderr capture
timeout
basic resource limits
```

demo:

```text
kullanıcı “run” der
go api run oluşturur
runner docker container başlatır
container basit python script çalıştırır
log ui’a düşer
run completed olur
```

bu sprint sistemin kalbi. bundan sonra artık slide değil ürün konuşuyoruz.

**sprint 7: ilk gerçek mne nodes**

kapsam:

```text
load edf/fif
filter
notch
rereference
basic output artifact
python runtime image
```

demo:

```text
sample eeg dosyası workflow’dan geçer
filtered output artifact olarak görünür
```

burada node sayısını abartmıyoruz. 4 node yeter. önemli olan graph → runner → python container → artifact zincirinin gerçekten çalışması.

**sprint 8: run history + artifact viewer**

kapsam:

```text
run list
run detail
node status
logs
artifact download
html/text preview
failed/completed states
```

demo:

```text
aynı workflow iki kez çalıştırılır
kullanıcı geçmiş run’ları görür
logları ve artifactları açar
```

mvp’nin ilk ciddi hissi burada oluşur. kullanıcı artık “bu bir editor değil, çalışma sistemi” der.

## faz 3 — gerçek eeg mvp: bids, report, provenance

**sprint 9: bids ingest + validation**

kapsam:

```text
bids folder upload/import
bids validator integration
validation warnings/errors
dataset metadata extraction
subject/session/task summary
```

demo:

```text
kullanıcı bids eeg dataset yükler
sistem validation report üretir
kaç subject/session olduğu görünür
```

business raporda bids ingestion/validation must-have sayılmıştı; veri standardı olmadan workflow paylaşımının kırılacağı açıkça belirtiliyor. 

**sprint 10: eeg preprocessing workflow tamamlanır**

kapsam:

```text
epoch
ica placeholder veya basic ica
psd
bandpower
csv/parquet feature output
```

demo:

```text
raw eeg → filter → epoch → psd/bandpower → feature table
```

burada hedef scientific perfect olmak değil; gerçek lab ile konuşabilecek kadar “uçtan uca” olmak.

**sprint 11: html report generation**

kapsam:

```text
summary report
dataset info
workflow params
basic figures
artifact links
methods text draft
```

demo:

```text
run sonunda report.html oluşur
kullanıcı report’u browser’da açar
publication/methods için kullanılabilir özet görür
```

ödeme motivasyonu burada güçlenir. çünkü “görsel node editor” tek başına para ettirmez; rapor, history ve handoff ettirir.

**sprint 12: workflow versioning + provenance v0**

kapsam:

```text
immutable workflow version
dataset snapshot link
plugin version link
run provenance graph v0
artifact lineage
restore/fork basic
```

demo:

```text
kullanıcı report içinden şunu görür:
workflow v3
dataset snapshot v2
plugin eeg-core@0.1.0
run id
produced artifacts
```

bu sprint sonunda pilot verilebilir ürün çıkar.

**mvp exit criteria:**

```text
1 gerçek eeg dataset çalışıyor
1 golden workflow uçtan uca çalışıyor
workflow versioning var
run history var
html report var
docker runner var
bids validation var
3-5 lab’a demo yapılabilir
```

bence burada ilk public/private pilot başlatılır.

## faz 4 — pilot ürünü: gerçek lab feedback ve public templates

**sprint 13: pilot installer + local-first packaging**

kapsam:

```text
docker compose setup
seed data
sample workflow
basic docs
healthcheck
local minio/postgres/runner
```

demo:

```text
bir lab kendi makinesinde kurar
sample workflow’u çalıştırır
```

ticari raporda da ilk 6–9 ay için full cloud platform yerine local-first + optional hosted workspace önerisi daha mantıklı görülüyordu; bu compliance riskini düşürür ve mevcut python/matlab yaşamını koparmaz. 

**sprint 14: public template gallery v0**

kapsam:

```text
public workflows
clone/fork
template cards
tags
basic search
```

demo:

```text
kullanıcı “eeg preprocessing basic” template’ini clone eder
kendi datasetinde çalıştırır
```

burada marketplace değil, public template gallery. daha basit ve daha erken değerli.

**sprint 15: pilot feedback sprint**

kapsam:

```text
3-5 lab görüşmesi
workflow migration
bug fixes
missing node list
ux fixes
performance fixes
```

demo:

```text
bir pilot lab’ın mevcut script akışı synaptix workflow’una çevrilir
önce/sonra karşılaştırması gösterilir
```

bu sprint özellikle ürün gerçekliği için önemli. sadece kod yazmayın; lab acısını ölçün.

**sprint 16: cli uploader + büyük dataset hazırlığı**

kapsam:

```text
cli auth
multipart upload
resume upload
dataset finalize
remote import skeleton
```

demo:

```text
kullanıcı terminalden dataset upload eder
web ui’da dataset snapshot oluşur
```

2 tb veri için browser upload yetmez. cli burada şart gibi.

## faz 5 — community repo: node sdk, contributor, benchmark

**sprint 17: python sdk alpha**

kapsam:

```text
python client
launch run
stream logs
download artifact
create dataset snapshot
```

demo:

```python
project.workflow("eeg-basic").run(dataset="sample")
```

teknik rapor rest-first ve python-sdk-first yaklaşımını öneriyor; çünkü kullanıcıların ve scientific wrapper yüzeyinin python-heavy olacağı net. 

**sprint 18: node sdk alpha**

kapsam:

```text
custom node decorator
input/output schema generation
params schema generation
local test runner
plugin manifest generation
```

demo:

```text
external developer 20 satır python ile custom node yazar
node editor’da görünür
local workflow’da çalışır
```

bu, marketplace’in asıl temeli. önce node sdk, sonra marketplace.

**sprint 19: moabb/braindecode nodes v0**

kapsam:

```text
moabb dataset/evaluation node
basic classifier node
braindecode training skeleton
benchmark report
```

demo:

```text
sample eeg benchmark workflow’u çalışır
report’ta accuracy/metrics görünür
```

gliahub canvas ve deck, mne/moabb/braindecode/torcheeg gibi ekosistemleri replace etmek yerine node/adaptor olarak platforma bağlamayı öneriyor. 

**sprint 20: workflow publish/fork + repo pages**

kapsam:

```text
public workflow page
readme
dataset card
report card
fork count
version list
```

demo:

```text
kullanıcı workflow’u public publish eder
başka kullanıcı fork edip çalıştırır
```

burada “github/openneuro/huggingface hissi” başlar.

## faz 6 — lab product: private workspace, rbac, audit

**sprint 21: private workspace + basic rbac**

kapsam:

```text
workspace members
roles
invite user
private workflows
private datasets
project-level permissions
```

demo:

```text
pi bir öğrenci davet eder
öğrenci workflow çalıştırır ama raw data indirme yetkisi olmaz
```

private workspace ilk gerçek monetization katmanı. deck’te free/oss tarafının local runner + public workflows; lab pro tarafının private repos, team workspace, version history, shared reports ve priority support olduğu yazıyordu. 

**sprint 22: audit log + immutable events**

kapsam:

```text
who uploaded
who ran
who changed workflow
who invited user
who downloaded artifact
append-only audit table
```

demo:

```text
lab admin tüm project activity’yi görür
bir report’un kim tarafından üretildiği izlenir
```

bu enterprise değil, lab güveni için bile gerekli.

**sprint 23: version diff + release workflow**

kapsam:

```text
workflow version diff
node param diff
dataset snapshot diff summary
release label
restore version
```

demo:

```text
v2 ile v3 arasında hangi node değiştiği görünür
kullanıcı eski versiyona dönüp run başlatır
```

burada git gibi ama git olmayan deneyim oturur. “branch/rebase” değil; “save version, diff, restore, fork”.

**sprint 24: report package export**

kapsam:

```text
zip export
report.html
workflow json
params
environment manifest
artifact manifest
citation/methods text
```

demo:

```text
kullanıcı paper supplement veya lab handoff için tek paket indirir
```

burası para eden yerlerden biri. “hocam sonuçlar burada” değil; “bu sonucu tekrar üretme paketi burada.”

## faz 7 — marketplace ve monetization

**sprint 25: marketplace alpha**

kapsam:

```text
plugin listing
domain packs
install/uninstall
official/community/verified labels
locked plugins
```

demo:

```text
eeg-core aktif görünür
cv-behavior pack locked görünür
kullanıcı plugin details sayfasını açar
```

burada ödeme entegrasyonu olmasa bile entitlement modeli çalışmalı.

**sprint 26: entitlements + plan gates**

kapsam:

```text
org plan
workspace entitlement
plugin access check
run-time entitlement validation
locked node behavior
```

demo:

```text
kullanıcı cv node içeren workflow’u açar
node görünür ama çalıştırılamaz
upgrade mesajı çıkar
```

önemli: entitlement sadece ui’da olmamalı, run sırasında backend de kontrol etmeli.

**sprint 27: workspace-local custom nodes**

kapsam:

```text
lab kendi node’unu yazar
private plugin olarak yükler
sadece kendi workspace’inde görünür
basic validation
```

demo:

```text
lab-specific preprocessing node’u marketplace’e çıkmadan private kullanılır
```

bu, public marketplace güvenlik yükünü almadan customizability sağlar.

**sprint 28: billing/usage events v0**

kapsam:

```text
usage_events
run minutes
storage usage
plugin usage
plan page
invoice mock
```

demo:

```text
admin dashboard’da storage/run/plugin usage görünür
```

gerçek stripe entegrasyonu şart değil. önce ölçüm.

## faz 8 — runner scale ve hosted execution beta

**sprint 29: nats jetstream + runner pool**

kapsam:

```text
job queue
runner heartbeat
job lease
dead letter
retry policy
runner labels
```

demo:

```text
iki runner ayağa kalkar
joblar dağıtılır
runner kapanınca job lost/requeued olur
```

ilk başta postgres job table yeterliydi. ama bu sprintten sonra sistem gerçek runner pool’a döner.

**sprint 30: resource-aware scheduling**

kapsam:

```text
cpu/memory hints
gpu label
workspace quota
job priority
resource validation
```

demo:

```text
8gb isteyen job küçük runner’a gitmez
gpu isteyen job gpu runner bekler
```

bu sprint k8s’siz scheduling’in sınırlarını test eder.

**sprint 31: container hardening**

kapsam:

```text
rootless/containerd evaluation
read-only fs
network policy default deny
seccomp/apparmor profile
signed images
image digest pinning
```

demo:

```text
kötü niyetli test node’u network/dosya yetkisi alamaz
runner güvenlik raporu üretir
```

teknik rapor da scientific jobların container’da kalmasını, gvisor gibi daha güçlü sandbox’ların ise hosted/untrusted code için hardening path olmasını öneriyor. 

**sprint 32: hosted workspace beta**

kapsam:

```text
managed control plane
managed object storage
managed runner small pool
workspace quotas
admin dashboard
```

demo:

```text
pilot lab hiçbir şey kurmadan hosted workspace’te sample workflow çalıştırır
```

burada hosted compute açılıyor ama kontrollü. gpu/large-scale değil.

## faz 9 — k8s/argo adapter, enterprise ve modality expansion

**sprint 33: execution backend abstraction hardening**

kapsam:

```text
docker backend interface cleanup
run contract stable
logs/status/artifacts standardization
backend conformance tests
```

demo:

```text
aynı workflow docker backend’de çalışır
test suite backend contract’ı doğrular
```

bu sprint argo için zemin.

**sprint 34: argo/k8s backend spike**

kapsam:

```text
argo backend adapter
workflow graph → argo workflow translation
dev k8s cluster
logs/artifacts bridge
```

demo:

```text
aynı workflow docker yerine argo backend’de çalışır
ui aynı kalır
```

k8s burada ürün dependency değil, backend opsiyonu olur. teknik rapor hosted execution, gpu/batch ve container-native multi-tenant workload için argo/k8s’i güçlü seçenek olarak görüyor. 

**sprint 35: enterprise auth v0**

kapsam:

```text
oidc provider integration
keycloak/zitadel option
sso login
org domain mapping
```

demo:

```text
kurumsal kullanıcı sso ile girer
workspace membership otomatik oluşur
```

saml/scim sonra gelebilir. ilk enterprise hareketi oidc yeter.

**sprint 36: dandi/openneuro import/export**

kapsam:

```text
openneuro import skeleton
dandi/nwb export skeleton
dataset card enrichment
public archive handoff
```

demo:

```text
public dataset import edilir
workflow çalışır
report/archive handoff paketi üretilir
```

burada private-to-public science loop güçlenir.

**sprint 37: fmri core pack v0**

kapsam:

```text
nifti load
basic nilearn node
glm/roi extraction skeleton
fmri report
```

demo:

```text
küçük fmri sample dataset üzerinde basit nilearn workflow çalışır
```

çok dikkat: bu sprintten önce eeg/meg product-market sinyali alınmış olmalı. yoksa scope creep.

**sprint 38: notebook/code workspace prototype**

kapsam:

```text
interactive container session
project files panel
artifact access
notebook export/import
cell → node prototype
```

demo:

```text
kullanıcı notebook içinde kod dener
çalışan hücreyi custom node’a promote eder
```

bu colab/kaggle hissini getirir ama core record hâlâ workflow version + execution run kalır.

## faz 10 — platform maturity

**sprint 39: collaboration v1**

kapsam:

```text
yjs realtime draft
presence
comments
review mode
manual version save
```

demo:

```text
iki kullanıcı aynı workflow draft’ını düzenler
sonra immutable version çıkarır
```

burada kritik ayrım korunmalı:

```text
draft = mutable
version = immutable
run = scientific record
```

**sprint 40: plugin marketplace review pipeline**

kapsam:

```text
plugin submission
automated tests
container scan
license scan
signature
verified badge
```

demo:

```text
external plugin submit edilir
ci’dan geçer
verified/community olarak marketplace’e düşer
```

bu olmadan public marketplace riskli.

**sprint 41: enterprise audit/compliance packet**

kapsam:

```text
data classification
retention policy
export/delete request
security docs
admin audit export
```

demo:

```text
enterprise buyer’a security packet gösterilir
admin audit log export eder
```

business raporda da data classification, local-first, hosted compute cogs, procurement drag ve eeg-first focus temel riskler olarak geçiyordu. 

**sprint 42: scale/performance sprint**

kapsam:

```text
large dataset cache
chunked artifact handling
parquet/duckdb paths
runner cache policy
storage cost dashboard
```

demo:

```text
büyük dataset sample’ı cache ile ikinci run’da daha hızlı çalışır
admin storage/compute cost görür
```

## hangi sprintte ne satılabilir?

bence ticari eşikler şöyle:

```text
sprint 12:
pilot verilebilir mvp

sprint 16:
gerçek lab kurulumu yapılabilir

sprint 20:
community/open-source motion başlar

sprint 24:
lab pro için para istenebilir

sprint 28:
marketplace/plan hikayesi gösterilebilir

sprint 32:
hosted beta açılabilir

sprint 36:
institutional conversation başlar

sprint 40+:
enterprise marketplace/compliance ciddi olur
```

## en önemli scope guard

şunu roadmap’in üstüne büyük yazardım:

```text
cv, fmri, marketplace, notebook, k8s, enterprise —
bunların hiçbiri eeg workflow mvp’sini daha iyi yapmıyorsa bekler.
```

çünkü ürünün tutup tutmayacağı sprint 30’da değil, sprint 12–16 arasında belli olacak.

ilk gerçek soru şu olacak:

```text
bir eeg/meg lab, kendi messy pipeline’ını buraya taşıyıp ikinci kez daha hızlı ve güvenilir çalıştırabiliyor mu?
```

cevap evetse platform büyür. cevap hayırsa marketplace de, k8s de, notebook da kurtarmaz.

ben html raporun içine bunu “execution roadmap” diye koyardım: üstte fazlar, altında sprintler, en sağda da “sprint demo” sütunu. bu sayede roadmap hem teknik hem yatırımcı tarafında çok daha inandırıcı görünür.

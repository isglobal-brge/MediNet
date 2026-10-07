"""Serve untouched Hub 2.0.1 templates with synthetic documentation fixtures.
No application database, authentication, network nodes or training is used.
Usage: python scripts/capture-hub-fixtures.py PATH_TO_HUB_CHECKOUT [port]
"""
import ast, json, sys
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace as NS
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
root = Path(sys.argv[1]).resolve() / 'MediNetHub'
port = int(sys.argv[2]) if len(sys.argv) > 2 else 8766
sys.path.insert(0, str(root))
from django.conf import settings
settings.configure(SECRET_KEY='documentation-fixture-only', DEBUG=True, ROOT_URLCONF=__name__, STATIC_URL='/static/', INSTALLED_APPS=['django.contrib.humanize'], TEMPLATES=[{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[str(root/'templates')],'APP_DIRS':True,'OPTIONS':{'libraries':{'webapp_filters':'webapp.templatetags.webapp_filters','dataset_filters':'webapp.templatetags.dataset_filters'}}}])
import django
django.setup()
from django.urls import path
from django.template.loader import render_to_string
urlpatterns=[]
for node in ast.walk(ast.parse((root/'webapp'/'urls.py').read_text())):
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'path':
        name=next((k.value.value for k in node.keywords if k.arg=='name'),None)
        if name: urlpatterns.append(path(node.args[0].value, lambda request: None, name=name))
now=datetime(2026,10,6,9,0,tzinfo=timezone.utc)
connections=[dict(id=1,name='Demo Hospital A',ip='192.0.2.10',port=5000,username='demo',active=True),dict(id=2,name='Demo Hospital B',ip='192.0.2.20',port=5000,username='demo',active=True)]
datasets=[dict(id=i,dataset_id=f'demo-tabular-{i}',dataset_name=f'Synthetic screening — site {i}',connection=c,num_rows=1200 if i==1 else 900,num_columns=52,size=128000,target_info=dict(type='binary_classification',num_classes=2,output_neurons=1,name='outcome'),features_info=dict(feature_types=dict(numeric=50,categorical=2),input_shape=[52],num_features=52,input_features=52),medical_domain='Synthetic demo',is_selected=True) for i,c in enumerate(connections,1)]
dlconfig={'model':{'architecture':{'layers':[{'type':'input','neurons':52},{'type':'linear','in_features':52,'out_features':64},{'type':'relu'},{'type':'linear','in_features':64,'out_features':32},{'type':'relu'},{'type':'linear','in_features':32,'out_features':1}]},'training':{'optimizer':{'type':'Adam','learning_rate':0.001},'loss_function':'BCEWithLogitsLoss'}}}
mlconfig={'algorithm':'dp_random_forest','hyperparameters':{'n_estimators':20,'max_depth':5}}
models=[dict(id=1,pk=1,name='Demo screening network',model_type='dl',created_at=now,updated_at=now,description='Synthetic example for documentation.',config_json=dlconfig),dict(id=2,pk=2,name='Demo private forest',model_type='ml',created_at=now,updated_at=now,description='Synthetic example for documentation.',config_json=mlconfig)]
job=dict(id=1,name='Demo federated screening',description='Synthetic documentation run',model_config=models[0],status='running',progress=60,current_round=6,total_rounds=10,created_at=now,started_at=now,budget_exhausted_nodes=[])
selected=[{**d,'name':d['dataset_name'],'connection_name':d['connection']['name'],'type':'tabular'} for d in datasets]
user=NS(is_authenticated=True,username='demo_researcher',first_name='Demo',notifications=NS(all=[]))
base=dict(user=user,global_connections_count=2,unread_notifications_count=0,connections=connections,datasets=datasets,projects=[dict(id=1,name='Documentation demo',color='#0891b2')],selected_project=dict(id=1,name='Documentation demo',color='#0891b2'),has_selected_datasets=True,project_colors=[('#0891b2','Cyan')],stats=dict(total_jobs=5,total_models=2,active_connections=2,success_rate=80,datasets_count=2),active_jobs=[job],recent_jobs=[job],models=models,available_jobs=[],selected_models=[],training_jobs=[job],model_configs=models,models_json=json.dumps(models,default=str),selected_datasets=selected,selected_datasets_json=json.dumps(selected),edit_mode=False,edit_model_json='null',model_id=1,job_id=1,job=job,csrf_token='documentation-fixture')
clients=[dict(id=f'demo-{i}',name=c['name'],status='active',description='Synthetic client',accuracy=81+i*2,loss=0.36-i*0.03,trend='stable',trend_value=0,train_samples=960 if i==1 else 720,test_samples=240 if i==1 else 180,response_time=1.2,ip=c['ip'],last_seen='Just now',rounds=6,rounds_history=[]) for i,c in enumerate(connections,1)]
base.update(clients=clients,overview_stats=dict(total_clients=2,active_clients=2,warning_clients=0,avg_accuracy=84),total_rounds=10,performance_chart_data={'labels':['R1','R2','R3','R4','R5','R6'],'accuracy':[.61,.66,.71,.75,.80,.84],'loss':[.75,.66,.58,.50,.41,.35]})
pages={'login':'login','panel':'dashboard_home','datasets':'datasets','model-studio':'model_studio','model-designer':'model_designer','model-designer-advanced':'model_designer_advanced','ml-model-designer':'ml_model_designer','training':'training','dashboard':'dashboard','client-dashboard':'client_dashboard'}
class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args): pass
    def do_GET(self):
        url=self.path.split('?')[0]
        try:
            if url.startswith('/static/'):
                file=(root/url.lstrip('/')).resolve()
                if not file.is_relative_to(root/'static'): raise ValueError('Invalid static path')
                body=file.read_bytes(); mime='text/css' if file.suffix=='.css' else 'text/javascript'
            elif url.startswith('/api/'):
                value={'count':0,'unread_count':0,'notifications':[],'success':True,'selected_datasets':selected,'active':True}
                if 'get-model-configs' in url: value={'models':models,'success':True}
                body=json.dumps(value,default=str).encode(); mime='application/json'
            else:
                key=url.strip('/').split('/')[0] or 'panel'
                template=pages[key]; context=dict(base)
                if 'empty' in self.path: context.update(active_jobs=[],recent_jobs=[],stats=dict(total_jobs=0,total_models=0,active_connections=0,success_rate=0,datasets_count=0),global_connections_count=0)
                if 'comparison' in self.path:
                    context['available_jobs']=[dict(id=1,name='Demo network A',created_at=now),dict(id=2,name='Demo network B',created_at=now)]
                    context['selected_models']=[dict(name='Demo network A' if i==0 else 'Demo network B',metrics=dict(accuracy=.84-i*.03,loss=.345+i*.045,f1=.835-i*.025,precision=.835-i*.03,recall=.835-i*.02),training_time='180s' if i==0 else '210s',config={'model':{'training':{'optimizer':{'type':'Adam','learning_rate':.001},'loss_function':'BCEWithLogitsLoss'}},'federated':{'name':'FedAvg','parameters':{'fraction_fit':1,'fraction_eval':1,'min_fit_clients':2,'min_eval_clients':2,'min_available_clients':2}},'train':{'rounds':10,'batch_size':32,'epochs':5}}) for i in range(2)]
                context['request']=NS(resolver_match=NS(url_name='user_dashboard' if key=='panel' else key.replace('-','_')))
                body=render_to_string('webapp/'+template+'.html',context).encode(); mime='text/html'
            self.send_response(200); self.send_header('Content-Type',mime); self.end_headers(); self.wfile.write(body)
        except Exception as error:
            self.send_response(500); self.end_headers(); self.wfile.write(str(error).encode())
print(f'Documentation fixture server http://127.0.0.1:{port}; templates: {root}',flush=True)
ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()

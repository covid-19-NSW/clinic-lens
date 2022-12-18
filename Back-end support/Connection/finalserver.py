from flask import Flask
from flask import Flask,render_template,jsonify,request,make_response

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

import matplotlib.pyplot as plt

import joblib
import pymysql
import os
#os.chdir("/Users/dongyu/Desktop/back-end/")
print(os.getcwd())
from flask_cors import CORS
from flask_cors import cross_origin
app = Flask(__name__)
CORS(app, resources=r'/*')

rfmodel=joblib.load(filename="/Users/dongyu/Desktop/training/rf.model")
xgmodel=joblib.load(filename="/Users/dongyu/Desktop/training/xg.model")


print("initialised")



db = pymysql.connect(host='localhost',
                     user='root',
                     password='dongyu123',#密码
                     database='Clinic')#数据库名
cursor = db.cursor()

colNeed = ['daycount','Season','personskm2','cliniccount','whichday','realhourspast3days','breakhourspast3days','weekHours','event_level',
             'driveThroughTesting','wheelchairAccessible','walkinAllowed','bookingRequired','ageLimit','referralRequired']

class databaser():
    def __init__(self,table_name):
        """
        table_name:表名
        
        """
        self.table_name=table_name
        self.get_desc()
    def get_desc(self):
        sql="desc "+self.table_name
        cursor.execute(sql)
        db.commit()
        res=np.array(cursor.fetchall())
        self.col_all=list(res[:,0])
        return list(res[:,0])
    def get_info(self,col,key,date,value):
        """
        col:需要的字段
        key:查找关键字
        value：关键字的值
	    date：日期数组
        """
        sql="SELECT * from "+self.table_name+" WHERE notification_date='"+ date +"' and " +key+"= '"+value + "'"
        print(sql)
        db.ping(reconnect=True)
        table=pd.DataFrame(columns=self.col_all)
        cursor.execute(sql)
        db.commit()
        res=cursor.fetchall()
        
        for i in res:
            table.loc[len(table)]=i
        out=table[col]
        return out

class complexdict:
    def __init__(self,dic):
        self.core_dict=dic
    def get(self,li):
        index=li[0]
        for i in range(1,len(li)):
            index+="["
            index+=str(li[i])
            index+="]"
        res=self.core_dict[index]
        return res
dealer=databaser("newwholeclinic")


@app.route("/")
def index():
    return "connected"


@app.route("/rfpredict1",methods=["POST"])
def rfpredict1():


    form=request.form.to_dict()
    form=complexdict(form)
    Y1=eval(form.get(["Y1"]))
    L1=form.get(["L1"])
    DataFrame1=pd.DataFrame(columns=colNeed)
    for i in range(int(L1)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame1",str(i),j])))
        DataFrame1.loc[len(DataFrame1)]=info

    pre_y=rfmodel.predict(DataFrame1)
    
    sum_ini=sum(pre_y)
    print("sum_ini",sum_ini)
    if float(Y1)!=0 and float(sum_ini) !=0:
        fs=round(Y1/sum_ini,1)
        pre_y=fs*pre_y
    else:
        print("get it")
        pre_y=[0 for i in range(len(DataFrame1))]


    print("pre_y",pre_y)
    print("sum",sum(pre_y))
    print("Y1",Y1)
    out=[]
    for i in pre_y:
        out.append(float("{:.1f}".format(i)))
    print("-----------------fi")
    return out

@app.after_request
def func_res(resp):     
    res = make_response(resp)
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST'
    res.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return res



@app.route("/test")
def test():
    return [1,2,3]

ci=0

@app.route("/rfpredict2",methods=["POST"])
def rfpredict2():
    """
    li:[DataFrame1,DataFrame2]
    Y:Y for DataFrame1
    """
   
    form=request.form.to_dict()
    form=complexdict(form)
    Y1=form.get(["Y1"])
    L1=form.get(["L1"])
    L2=form.get(["L2"])
    DataFrame1=pd.DataFrame(columns=colNeed)
    for i in range(int(L1)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame1",str(i),j])))
        DataFrame1.loc[len(DataFrame1)]=info
    DataFrame2=pd.DataFrame(columns=colNeed)
    for i in range(int(L2)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame2",str(i),j])))
        DataFrame2.loc[len(DataFrame2)]=info
    pre_y1=rfmodel.predict(DataFrame1)
    amount=len(pre_y1)

    if sum(pre_y1)!=0 and  eval(Y1)!=0:
        fs=round(eval(Y1)/sum(pre_y1),1)
        
        pre_y2=rfmodel.predict(DataFrame2)
        pre_y2=pre_y2*fs
        Y2=sum(pre_y2)
    elif sum(pre_y1)==0:
        pre_y2=[0 for i in range(len(DataFrame2))]
    elif eval(Y1)==0:
        pre_y2=rfmodel.predict(DataFrame2)
        
    global ci
    ci+=1

    if ci<=10:
        print("------------------------------")
        #print(DataFrame1)
        #print(DataFrame2)
        print("fs",fs)
        print("Y1",Y1)
        print("sum",sum(pre_y1))
    
    out=[]
    for i in list(pre_y2):
        out.append(float("{:.1f}".format(i)))
    print(ci,out)
    return out


@app.route("/xgpredict1",methods=["POST"])
def xgpredict1():

    form=request.form.to_dict()
    form=complexdict(form)
    Y1=eval(form.get(["Y1"]))
    L1=form.get(["L1"])
    DataFrame1=pd.DataFrame(columns=colNeed)
    for i in range(int(L1)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame1",str(i),j])))
        DataFrame1.loc[len(DataFrame1)]=info

    pre_y=xgmodel.predict(DataFrame1)

    sum_ini=sum(pre_y)
    print("sum_ini",sum_ini)
    if float(Y1)!=0 and float(sum_ini) !=0:
        fs=round(Y1/sum_ini,1)
        pre_y=fs*pre_y
    else:
        print("get it")
        pre_y=[0 for i in range(len(DataFrame1))]
    print("pre_y",pre_y)
    print("sum",sum(pre_y))
    print("Y1",Y1)
    out=[]
    for i in pre_y:
        if i<0:
            i = 0
        print("i", i)
        out.append(float("{:.1f}".format(i)))
    print("-----------------fi")
    return out

@app.route("/xgpredict2",methods=["POST"])
def xgpredict2():
    """
    li:[DataFrame1,DataFrame2]
    Y:Y for DataFrame1
    """
    
    form=request.form.to_dict()
    form=complexdict(form)
    Y1=form.get(["Y1"])
    L1=form.get(["L1"])
    L2=form.get(["L2"])
    DataFrame1=pd.DataFrame(columns=colNeed)
    for i in range(int(L1)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame1",str(i),j])))
        DataFrame1.loc[len(DataFrame1)]=info
    DataFrame2=pd.DataFrame(columns=colNeed)
    for i in range(int(L2)):
        info=[]
        for j in colNeed:
            info.append(float(form.get(["Frame2",str(i),j])))
        DataFrame2.loc[len(DataFrame2)]=info
    pre_y1=xgmodel.predict(DataFrame1)
    amount=len(pre_y1)

    if sum(pre_y1)!=0 and  eval(Y1)!=0:
        fs=round(eval(Y1)/sum(pre_y1),1)
        
        pre_y2=xgmodel.predict(DataFrame2)
        pre_y2=pre_y2*fs
        Y2=sum(pre_y2)
    elif sum(pre_y1)==0:
        pre_y2=[0 for i in range(len(DataFrame2))]
    elif eval(Y1)==0:
        pre_y2=xgmodel.predict(DataFrame2)
        
    global ci
    ci+=1

    if ci<=10:
        print("------------------------------")
        #print(DataFrame1)
        #print(DataFrame2)
        print("fs",fs)
        print("Y1",Y1)
        print("sum",sum(pre_y1))
    
    out=[]
    for i in list(pre_y2):
        if i<0:
            i = 0
        out.append(float("{:.1f}".format(i)))
    print(ci,out)
    return out


    

CORS(app)


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5001,debug=True)



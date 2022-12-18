import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import joblib
import os


def rf_xg(_csv_path, showflag=False, saveflag=False):
    df = pd.read_csv(_csv_path)
    xcol = ['daycount','Season','personskm2','cliniccount','whichday','realhourspast3days','breakhourspast3days','weekHours','event_level',
             'driveThroughTesting','wheelchairAccessible','walkinAllowed','bookingRequired','ageLimit','referralRequired']

    X = df[xcol]
    y = df['test_count']

    regr = RandomForestRegressor()
    # regr = RandomForestRegressor(random_state=1,
    #                              bootstrap=True,
    #                              max_depth=3,
    #                              max_features=5,
    #                              min_samples_leaf=3,
    #                              min_samples_split=5,
    #                              n_estimators=100)
    regx = XGBRegressor()
    # regx = XGBRegressor(max_depth=3,  # 每一棵树最大深度，默认6；
    #                          learning_rate=0.1,  # 学习率，每棵树的预测结果都要乘以这个学习率，默认0.3；
    #                          n_estimators=100,  # 使用多少棵树来拟合，也可以理解为多少次迭代。默认100；
    #                          objective='reg:linear',  # 此默认参数与 XGBClassifier 不同
    #                          booster='gbtree',  # 有两种模型可以选择gbtree和gblinear。gbtree使用基于树的模型进行提升计算，gblinear使用线性模型进行提升计算。默认为gbtree
    #                          gamma=0,  # 叶节点上进行进一步分裂所需的最小"损失减少"。默认0；
    #                          min_child_weight=1,  # 可以理解为叶子节点最小样本数，默认1；
    #                          subsample=1,  # 训练集抽样比例，每次拟合一棵树之前，都会进行该抽样步骤。默认1，取值范围(0, 1]
    #                          colsample_bytree=1,  # 每次拟合一棵树之前，决定使用多少个特征，参数默认1，取值范围(0, 1]。
    #                          reg_alpha=0,  # 默认为0，控制模型复杂程度的权重值的 L1 正则项参数，参数值越大，模型越不容易过拟合。
    #                          reg_lambda=1,  # 默认为1，控制模型复杂度的权重值的L2正则化项参数，参数越大，模型越不容易过拟合。
    #                          random_state=0)  # 随机种子


    # pipe_rf = Pipeline([('scaler', StandardScaler()), ('reduce_dim', PCA()), ('regressor', regr)])
    # pipe_xg = Pipeline([('scaler', StandardScaler()), ('reduce_dim', PCA()), ('regressor', regx)])
    # pipe_rf.fit(X, y)
    # pipe_xg.fit(X, y)

    regr.fit(X, y)
    regx.fit(X, y)

    if saveflag:
        # 将训练的模型保存到磁盘(value=模型名)   默认当前文件夹下
        joblib.dump(filename='rf.model', value=regr)
        joblib.dump(filename='xg.model', value=regx)

    if showflag:
        pre_rf = regr.predict(X)
        pre_xg = regx.predict(X)

        print('mse of RandomForestRegressor', mean_squared_error(y, pre_rf))
        print('mse of XGBRegressor', mean_squared_error(y, pre_xg))

        feature_importance = regr.feature_importances_ * 100
        rel_imp = pd.Series(feature_importance, index=X.columns).sort_values(inplace=False)
        rel_imp.T.plot(kind='barh', color='r', )
        plt.xlabel('Variable Importance')
        plt.title('RandomForestRegressor')
        plt.show()
        print('Variable Importance of RandomForestRegressor\n', rel_imp)

        feature_importance = regx.feature_importances_ * 100
        rel_imp = pd.Series(feature_importance, index=X.columns).sort_values(inplace=False)
        rel_imp.T.plot(kind='barh', color='b', )
        plt.xlabel('Variable Importance')
        plt.title('XGBRegressor')
        plt.show()
        print('*'*50)
        print('Variable Importance of XGBRegressor\n', rel_imp)

        plt.figure()
        plt.scatter(y, pre_rf, color="r")
        a = range(int(y.min()), int(y.max()))
        plt.plot(a, a, 'g--')

        plt.show()

        plt.figure()
        plt.scatter(y, pre_xg, color='b')
        a = range(int(y.min()), int(y.max()))
        plt.plot(a, a, 'g--')
        plt.show()


if __name__ == '__main__':
    root0 = os.path.dirname(os.path.abspath(__file__))
    print('py文件所在目录：', root0)

    csv_name = 'NewTraining.csv'
    csv_path = os.path.join(root0, csv_name)

    rf_xg(csv_path, showflag=True, saveflag=True)

    # model_rf = joblib.load(filename="rf.model")
    # model_xg = joblib.load(filename="xg.model")








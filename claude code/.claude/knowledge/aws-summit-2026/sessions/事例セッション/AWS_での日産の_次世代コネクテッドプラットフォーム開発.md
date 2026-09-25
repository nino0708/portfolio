---
title: "AWS での日産の 次世代コネクテッドプラットフォーム開発"
category: "事例セッション"
session_id: "ARC209"
pages: 29
topics: ["アーキテクチャ/サーバーレス"]
services: ["AWS Glue", "AWS Lambda", "Amazon EKS", "Amazon Kinesis", "Amazon S3"]
source_pdf: "/Users/itsukinino/Desktop/AWS Summit セッション資料/事例セッション/AWS での日産の 次世代コネクテッドプラットフォーム開発.pdf"
---
# AWS での日産の 次世代コネクテッドプラットフォーム開発


## p.1

ARC209
AWS での日産の
次世代コネクテッドプラットフォーム開発
村松寿郎
日産自動車株式会社
ソフトウェアデファインドビークル開発本部
オフボードプラットフォーム＆サービス開発部エキスパートリーダー


## p.2

自己紹介
1991
2000
2011
2016
2019
2006
2009
2001
2013
日産自動車入社
研究所
ビジネス
開発
@US #1
@US #2
@US #3
無線・通信HW
車載マルチメディア
コネクテッドシステム
コネクテッドカー、サービスビジネス
コネクテッドカー通信ユニット＆クラウドシステム
コネクテッドカークラウドシステム
＋Mobile APP
開発&運用
コネクテッドカー＆サービスアーキテクチャ
車載コンピュータ
ソフトウェアデファインドビークルクラウドシステム


## p.7

AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
AI-Drive技術
AI-Partner技術
Nissan Scalable Open OS 
SDV Platform
AI-Partner
AI-Drive
AI-Defined Vehicle


## p.8

AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
Nissan Scalable Open OS 
AI-Drive技術
AI-Partner技術
SDV Platform
AI-Partner
AI-Drive


## p.10

AI-Drive のパートナーシップ
Wayve for Autonomous Drive 
Uber and Wayve for Robotaxi


## p.11

AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
Nissan Scalable Open OS 
AI-Drive技術
AI-Partner技術
SDV Platform
AI-Partner
AI-Drive


## p.13

車内体験と外部サービスを繋ぐAI エージェント
External services
外部サービス
Service agent
サービス
エージェント
UX Agent
UXエージェント


## p.15

AI-Defined Vehicle = Software Defined Vehicle X AI
自動運転
個々に合わせた
空間と体験の提供
Nissan Scalable Open OS 
AI-Drive技術
AI-Partner技術
SDV Platform
AI-Partner
AI-Drive


## p.16

SDV で目指す世界
Upgradability
素早く、進化し続ける
Personalization
個人に最適化する
おもてなしパートナー
Biz Opportunity
“新たなビジネス”の可能性を拓く
3rd party
End Users
Versatility
移動手段のみにとどまらない使われ方
運転特性
車両・環境情報
e-4ORCE Update
HMI Customize
View addition
分析
運転のナビゲート
運転前後の気遣い
乗員への気配り
SOP


## p.17

Nissan Scalable Open Software Platform
Nissan Scalable
Open Data
Vehicle
OTA
System
Customer
Engineering Cloud
CI/CD
Machine Learning
Training
Software
Evaluation
Data Processing
Hardware
Central HPC
Middleware
OS
Body
New
App
CCS
PWT/
VMC
Applications
…
ECU
ECU
ECU
ECU
Billing
System
Nissan 
Connect
Software
Nissan Scalable
Open SDK
Nissan Scalable
Open OS
3rd party developer
Regional developer
…
AWS re:Invent 2025
- How Nissan Accelerated 
Software-Defined Vehicle 
Development with AWS (IND382)
https://www.youtube.com/watch?v
=FWrNnwQjKlM&t=5s


## p.18

Connected Platform
Nissan Scalable
Open Data
Vehicle
OTA
System
Customer
Engineering Cloud
CI/CD
Machine Learning
Training
Software
Evaluation
Data Processing
Hardware
Central HPC
Middleware
OS
Body
New
App
CCS
PWT/
VMC
Applications
…
ECU
ECU
ECU
ECU
Billing
System
Nissan 
Connect
Software
Nissan Scalable
Open SDK
Nissan Scalable
Open OS
3rd party developer
Regional developer
…


## p.19

Current Connected Car and Services Overview
■お客様・車両・デバイスを接続し、モバイルやプロバイダと連携したサービス等を提供
CONNECTED PLATFORM
Powering Seamless Connecting Platform


## p.20

Next Generation Nissan Intelligent Cloud Concept


## p.21

Next Generation Connected Platform: Philosophy and Challenges
High scalability for vehicle and data volume
Microservice, loose coupling, event driven architecture
Multi tenancy for partner vehicles
Development/operation cost and time-to-market minimization
Flexible and optimal data handling, OTA update capability improvement
Existing cars migration, services continuation with design optimization


## p.22

High Level Architecture of Next Generation Connected Platform
■Enable AIDV, Build for Scale and Design for the Flexible Expansion
BUILD ON AWS


## p.23

Next Generation Connected Platform Concept on AWS (under study)
INGEST
PROCESS
STORE
SERVE & ACT
AIDV & AI
AWS IoT Core
Amazon Kinesis
Amazon 
EventBridge
AWS Lambda
AWS Glue
Amazon EMR
Amazon 
Bedrock
Amazon 
SageMaker
Amazon 
OpenSearch 
Service
Amazon
DynamoDB
Amazon S3
Amazon 
Redshift
Amazon API 
Gateway
AWS AppSync
AWS Lambda
BUILD ON AWS


## p.24

Optimal Data Handling
■コストを最適化しつつ用途に応じたソリューションで対応
AWS 
Lambda
Amazon EKS
Amazon 
DynamoDB
Amazon 
ElastiCache
Amazon API 
Gateway
AWS Glue
Amazon 
Athena
Amazon 
EMR
Amazon 
Redshift
Amazon 
SageMaker
Amazon 
OpenSearch 
Service
Amazon S3
Scalable data lake storage
Amazon MSK
Real-time data streaming


## p.25

Global Deployment and Operation
■One Global Master Data Platform and Three Regional Platforms


## p.26

Why AWS
High scalability at global scale
Rich service components to realize required functions
Development and operation cost
Company wide data handling
High reliability and security


## p.27

AWS Expoの日産自動車ブースで実車のデモ展示しております
AWS セッション
Room 05
パートナー
セッション
Room 09
AWS セッション
Room 04
AWS セッション
Room 02
AWS セッション
Room 01
AWS セッション
Room 03
AWS
Customer
AWS セッション
Room 10
事例セッション
Room 11
事例セッション
Room 12
事例セッション
Room 13
事例セッション
Room 14
Partner Solution Expo
Hall 8
Hall 7
Hall 4
AWS for
Industries
AWS for
Industries
AWS
Builders’
Fair
AWS
Village
AWS
Village
Startup
Zone
Developer
Community
Lounge
基調講演/ スペシャルセッション
Central
Entrance
Hall 6
Hall 5
パートナー
セッション
Room 07
パートナー
セッション
Room 08
パートナー
セッション
Room 06
AWS Expo
パートナー
Nissan Scalable
Open Data
Vehicle
OTA
System
Customer
Engineering Cloud
CI/CD
Machine Learning
Training
Software
Evaluation
Data Processing
Hardware
Central HPC
Middleware
OS
Body
New
App
CCS
PWT/
VMC
Applications
…
ECU
ECU
ECU
ECU
Billing
System
Nissan 
Connect
Software
Nissan Scalable
Open SDK
Nissan Scalable
Open OS
…
Nissan Scalable Open Software Platform


## p.28

Exhibition Booth Information
展示ブースのご案内
A003
日産自動車株式会社
AWS for Industries Zone①


## p.29

本セッションのアンケートへ
ご協力をお願いします
Please give us your feedback
Thank you!
ARC209

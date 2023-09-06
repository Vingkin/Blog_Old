---
title: ElasticSearch
author: Vingkin
date: 2023-9-4
---

## 1. 基本概念

### 1.1 索引（Index）

一个索引就是一个拥有几分相似特征的文档的集合。比如说，你可以有一个客户数据的索引，另一个产品目录的索引，还有一个订单数据的索引。一个索引由一个名字来标识（必须全部是小写字母），并且当我们要对这个索引中的文档进行索引、搜索、更新和删除的时候，都要使用到这个名字。在一个集群中，可以定义任意多的索引。

能搜索的数据必须索引，这样的好处是可以提高查询速度，比如：新华字典前面的目录就是索引的意思，目录可以提高查询速度。

**<font color="red">Elasticsearch索引的精髓：一切设计都是为了提高搜索的性能。</font>**

### 1.2 类型（Type）

在一个索引中，你可以定义一种或多种类型。

一个类型是你的索引的一个逻辑上的分类/分区，其语义完全由你来定。通常，会为具有一组共同字段的文档定义一个类型。不同的版本，类型发生了不同的变化。

| 版本 | Type                                           |
| :--: | ---------------------------------------------- |
| 5.x  | 支持多种Type                                   |
| 6.x  | 只能有一种Type                                 |
| 7.x  | 默认不再支持自定义索引类型（默认类型为：_doc） |

### 1.3 文档（Document）

一个文档是一个可被索引的基础信息单元，也就是一条数据。

比如：你可以拥有某一个客户的文档，某一个产品的一个文档，当然，也可以拥有某个订单的一个文档。文档以JSON（Javascript Object Notation）格式来表示，而JSON是一个到处存在的互联网数据交互格式。

在一个index/type里面，你可以存储任意多的文档。

### 1.4 字段（Field）

相当于是数据表的字段，对文档数据根据不同属性进行的分类标识。

### 1.5 映射（Mapping）

mapping是处理数据的方式和规则方面做一些限制，如：某个字段的数据类型、默认值、分析器、是否被索引等等。这些都是映射里面可以设置的，其它就是处理ES里面数据的一些使用规则设置也叫做映射，按着最优规则处理数据对性能提高很大，因此才需要建立映射，并且需要思考如何建立映射才能对性能更好。

### 1.6 分片（Shards）

一个索引可以存储超出单个节点硬件限制的大量数据。比如，一个具有10亿文档数据的索引占据1TB的磁盘空间，而任一节点都可能没有这样大的磁盘空间。或者单个节点处理搜索请求，响应太慢。为了解决这个问题，Elasticsearch提供了将索引划分成多份的能力，每一份就称之为分片。当你创建一个索引的时候，你可以指定你想要的分片的数量。每个分片本身也是一个功能完善并且独立的“索引”，这个“索引”可以被放置到集群中的任何节点上。

分片很重要，主要有两方面的原因：

* 允许你水平分割 / 扩展你的内容容量。
* 允许你在分片之上进行分布式的、并行的操作，进而提高性能/吞吐量。

至于一个分片怎样分布，它的文档怎样聚合和搜索请求，是完全由Elasticsearch管理的，对于作为用户的你来说，这些都是透明的，无需过分关心。

<font color="red">被混淆的概念是，一个 Lucene 索引 我们在 Elasticsearch 称作分片 。 一个 Elasticsearch 索引是分片的集合。 当 Elasticsearch 在索引中搜索的时候，他发送查询到每一个属于索引的分片(Lucene 索引)，然后合并每个分片的结果到一个全局的结果集。</font>

### 1.7 副本（Replicas）

在一个网络 / 云的环境里，失败随时都可能发生，在某个分片/节点不知怎么的就处于离线状态，或者由于任何原因消失了，这种情况下，有一个故障转移机制是非常有用并且是强烈推荐的。为此目的，Elasticsearch允许你创建分片的一份或多份拷贝，这些拷贝叫做复制分片(副本)。

复制分片之所以重要，有两个主要原因：

* 在分片/节点失败的情况下，提供了高可用性。因为这个原因，注意到复制分片从不与原/主要（original/primary）分片置于同一节点上是非常重要的。
* 扩展你的搜索量/吞吐量，因为搜索可以在所有的副本上并行运行。

总之，每个索引可以被分成多个分片。一个索引也可以被复制0次（意思是没有复制）或多次。一旦复制了，每个索引就有了主分片（作为复制源的原来的分片）和复制分片（主分片的拷贝）之别。分片和复制的数量可以在索引创建的时候指定。在索引创建之后，你可以在任何时候动态地改变复制的数量，但是你事后不能改变分片的数量。默认情况下，Elasticsearch中的每个索引被分片1个主分片和1个复制，这意味着，如果你的集群中至少有两个节点，你的索引将会有1个主分片和另外1个复制分片（1个完全拷贝），这样的话每个索引总共就有2个分片，我们需要根据索引需要确定分片个数。

### 1.8 分配（Allocation）

将分片分配给某个节点的过程，包括分配主分片或者副本。如果是副本，还包含从主分片复制数据的过程。这个过程是由master节点完成的。

## 2. 入门操作

### 2.1 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>7.8.0</version>
    </dependency>

    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.8.0</version>
    </dependency>

    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.8.2</version>
    </dependency>

    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.8.2</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.9</version>
    </dependency>

    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 2.2 客户端对象

因为早期版本的客户端对象已经不再推荐使用，且在未来版本中会被删除，所以这里我们采用高级 REST 客户端对象。

```java
public class ESTestClient {

    private ESTestClient() {
    }

    private static class SingletonHolder {
        private static final RestHighLevelClient INSTANCE = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        private static void close() {
            try {
                INSTANCE.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static RestHighLevelClient getInstance() {
        // 创建es客户端
        return SingletonHolder.INSTANCE;
    }

    public static void close() {
        SingletonHolder.close();
    }
}
```

### 2.3 索引操作

**2.3.1 创建索引**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 创建索引
CreateIndexRequest request = new CreateIndexRequest("user");
CreateIndexResponse response = client.indices().create(request, RequestOptions.DEFAULT);
// 响应状态
boolean acknowledged = response.isAcknowledged();
log.info("索引操作：{}", acknowledged);
ESTestClient.close();
```

**2.3.2 删除索引**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 删除索引
DeleteIndexRequest request = new DeleteIndexRequest("user");
AcknowledgedResponse response = client.indices().delete(request, RequestOptions.DEFAULT);
// 响应状态
log.info("索引删除：{}", response.isAcknowledged());
ESTestClient.close();
```

**2.3.3 查询索引**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 查询索引
GetIndexRequest request = new GetIndexRequest("user");
GetIndexResponse response = client.indices().get(request, RequestOptions.DEFAULT);
// 响应状态
log.info("索引查询getAliases：{}", response.getAliases());
log.info("索引查询getMappings：{}", response.getMappings());
log.info("索引查询getSettings：{}", response.getSettings());
ESTestClient.close();
```

### 2.4 文档操作

**2.4.1 创建数据模型**

```java
public class User {

    private String name;
    private String sex;
    private Integer age;

}
```

**2.4.2 新增文档**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 插入数据
IndexRequest request = new IndexRequest();
request.index("user").id("1001");

// 构建数据
User user = new User("zhangsan", "男", 30);
ObjectMapper mapper = new ObjectMapper();
String userJson = mapper.writeValueAsString(user);

request.source(userJson, XContentType.JSON);
IndexResponse response = client.index(request, RequestOptions.DEFAULT);

ESTestClient.close();
```

**2.4.3 修改文档**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 修改数据
UpdateRequest request = new UpdateRequest();
request.index("user").id("1001");

request.doc(XContentType.JSON, "sex", "女", "age" , 18);
UpdateResponse response = client.update(request, RequestOptions.DEFAULT);

ESTestClient.close();
```

**2.4.4 查询文档**

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 查询数据
GetRequest request = new GetRequest();
request.index("user").id("1001");

GetResponse response = client.get(request, RequestOptions.DEFAULT);

ESTestClient.close();
```

**2.4.5 批量新增**

```java
RestHighLevelClient client = ESTestClient.getInstance();

// 批量插入数据
BulkRequest request = new BulkRequest();
User user1 = new User("zhangsan", "男", 30);
User user2 = new User("lisi", "男", 18);
User user3 = new User("wangwu", "女", 20);
ObjectMapper mapper = new ObjectMapper();

request.add(new IndexRequest().index("user").id("1001").source(mapper.writeValueAsString(user1), XContentType.JSON));
request.add(new IndexRequest().index("user").id("1002").source(mapper.writeValueAsString(user2), XContentType.JSON));
request.add(new IndexRequest().index("user").id("1003").source(mapper.writeValueAsString(user3), XContentType.JSON));
request.add(new 

BulkResponse response = client.bulk(request, RequestOptions.DEFAULT);

ESTestClient.close();
```

## 3. 高级查询

### 3.1 查询索引中所有的数据

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 1、查询索引中所有的数据
SearchRequest request = new SearchRequest();
request.indices("user");

request.source(new SearchSourceBuilder().query(QueryBuilders.matchAllQuery()));
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.2 条件查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 2、条件查询
SearchRequest request = new SearchRequest();
request.source(new SearchSourceBuilder().query(QueryBuilders.termQuery("age", 30)));

SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.3 分页查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 3、分页查询
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
builder.from(0);
builder.size(2);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.4 查询排序

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 4、查询排序
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
builder.sort("age", SortOrder.ASC);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.5 查询字段过滤

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 5、查询字段过滤
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
String[] include = {"name"};
String[] exclude = {};
builder.fetchSource(include, exclude);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.6 组合查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 6、组合查询
SearchRequest request = new SearchRequest();
request.indices("user");
BoolQueryBuilder query = QueryBuilders.boolQuery();
// query.must(QueryBuilders.matchQuery("sex", "女"));
query.should(QueryBuilders.matchQuery("age", "45"));
SearchSourceBuilder builder = new SearchSourceBuilder().query(query);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.7 范围查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 7、范围查询
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder();
RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery("age");
rangeQuery.gte(30);
rangeQuery.lte(50);
builder.query(rangeQuery);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.8 模糊查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 8、模糊查询
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder();
FuzzyQueryBuilder fuzzyQuery = QueryBuilders.fuzzyQuery("name", "wangwu");
// 一个字符不同也能匹配成功
fuzzyQuery.fuzziness(Fuzziness.ONE);
builder.query(fuzzyQuery);
request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.9 高亮查询

```java
        RestHighLevelClient client = ESTestClient.getInstance();
        // 9、高亮查询
        SearchRequest request = new SearchRequest();
        request.indices("user");
        SearchSourceBuilder builder = new SearchSourceBuilder();
        TermsQueryBuilder termsQuery = QueryBuilders.termsQuery("name", "wangwu");

        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.preTags("<font color='red'>");
        highlightBuilder.postTags("</font>");
        highlightBuilder.field("name");

        builder.highlighter(highlightBuilder);
        builder.query(termsQuery);
        request.source(builder);
        SearchResponse response = client.search(request, RequestOptions.DEFAULT);
        SearchHits hits = response.getHits();

        hits.forEach(hit -> {
            System.out.println(hit.getSourceAsString());
        });
        ESTestClient.close();
```

### 3.10 聚合查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 10、聚合查询
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder();

AggregationBuilder aggregationBuilder = AggregationBuilders.max("maxAge").field("age");
builder.aggregation(aggregationBuilder);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

### 3.11 分组查询

```java
RestHighLevelClient client = ESTestClient.getInstance();
// 11、分组查询
SearchRequest request = new SearchRequest();
request.indices("user");
SearchSourceBuilder builder = new SearchSourceBuilder();

AggregationBuilder aggregationBuilder = AggregationBuilders.terms("ageGroup").field("age");
builder.aggregation(aggregationBuilder);

request.source(builder);
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
SearchHits hits = response.getHits();

hits.forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
ESTestClient.close();
```

## 4. 框架集成

### 4.1 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-test</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
    </dependency>
</dependencies>
```

### 4.2 配置类编写

```yaml
elasticsearch:
  host: localhost
  port: 9200

logging:
  level:
    com.vingkin.esspringboot: debug
```

```java
@ConfigurationProperties(prefix = "elasticsearch")
@Configuration
@Data
public class ElasticsearchConfig extends AbstractElasticsearchConfiguration {

    private String host;
    private Integer port;

    @Override
    public RestHighLevelClient elasticsearchClient() {
        RestClientBuilder builder = RestClient.builder(new HttpHost(host, port));
        return new RestHighLevelClient(builder);
    }
}
```

### 4.3 实现

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(indexName = "product")
public class Product {

    @Id
    private Long id;

    @Field(type = FieldType.Text)
    private String title;

    // keyword表示关键字不分开（不分词）
    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Double)
    private Double price;

    // index=false表示不做索引关联（不能用images来查询）
    @Field(type = FieldType.Keyword, index=false)
    private String images;

}
```

```java
@Repository
public interface ProductDao extends ElasticsearchRepository<Product, Long> {

}
```

```java
@SpringBootTest
@Slf4j
class EsSpringbootApplicationTests {

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @Autowired
    private ProductDao productDao;

    // 创建索引
    @Test
    public void createIndex() {
        // 系统会扫描@Document(indexName = "product")后自动创建索引
        log.info("创建索引");
    }

    // 删除索引
    @Test
    public void deleteIndex() {
        boolean b = elasticsearchRestTemplate.deleteIndex(Product.class);
    }

    // 新增文档
    @Test
    public void docSave() {
        Product product = new Product(3L, "华为手机", "手机", 3999.0, "http://www.images.com/valsdkf/1.jpg");
        productDao.save(product);
    }

    // 修改文档（和新增一致）
    @Test
    public void updateSave() {
        Product product = new Product(5L, "ipad2018", "平板", 4999.0, "http://www.images.com/valsdkf/1.jpg");
        productDao.save(product);
    }

    // 文档根据id查询
    @Test
    public void findById() {
        Product product = productDao.findById(2L).get();
        log.info("查询结果：{}", product);
    }

    // 文档查询所有
    @Test
    public void findAll() {
        Iterable<Product> all = productDao.findAll();
        all.forEach(System.out::println);
    }

    // 文档文档删除
    @Test
    public void docDelete() {
        productDao.deleteById(2L);
    }

    // 文档批量新增
    @Test
    public void saveAll() {
        List<Product> productList = new ArrayList<>();
        // 省略创建productList过程
        productDao.saveAll(productList);
    }

    // 文档分页查询
    @Test
    public void findByPageable() {
        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        int currentPage = 0;
        int pageSize = 3;
        // 设置查询分页
        PageRequest pageRequest = PageRequest.of(currentPage, pageSize, sort);
        // 分页查询
        Page<Product> productPage = productDao.findAll(pageRequest);
        productPage.forEach(System.out::println);
    }

    // 条件查询+分页
    @Test
    public void termQueryByPage() {
        int currentPage = 0;
        int pageSize = 3;
        // 设置查询分页
        PageRequest pageRequest = PageRequest.of(currentPage, pageSize);
        // 设置查询条件
        TermQueryBuilder termQuery = QueryBuilders.termQuery("category", "手机");
        Page<Product> products = productDao.search(termQuery, pageRequest);
        products.forEach(System.out::println);
    }

}
```

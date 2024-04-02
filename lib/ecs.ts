import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export interface ecsProps {
  vpc: ec2.Vpc
}

export class ECS extends Construct {
  public readonly clusterName: string;
  public readonly service: ecs.FargateService;

  constructor(scope: Construct, id: string, props: ecsProps) {
    super(scope, id);

    // Create an ECS cluster and attach to the application load balancer
    const cluster = new ecs.Cluster(this, "webappCluster", { vpc: props.vpc });

    this.clusterName = cluster.clusterName;

    // get ecr repository called webapp-project
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "MyRepository",
      "webapp-project"
    );

    // pull the webapp:latest image from the repository
    const image = ecs.ContainerImage.fromEcrRepository(repository, "latest");

    // Create a task definition
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "WebAppTaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );

    // Add a container to the task definition and specify the image
    const container = taskDefinition.addContainer("WebAppContainer", {
      image,
      logging: ecs.LogDriver.awsLogs({ streamPrefix: "webapp-logs-fargate" }),
    });

    // Add port mappings to the container
    container.addPortMappings({
      containerPort: 5000, // the port your application listens on
    });

    // deploy the task definition to the cluster
    const service = new ecs.FargateService(this, "WebAppFargateService", {
      cluster,
      taskDefinition,
      assignPublicIp: false,
      desiredCount: 1,
    });

    this.service = service;
  }
}

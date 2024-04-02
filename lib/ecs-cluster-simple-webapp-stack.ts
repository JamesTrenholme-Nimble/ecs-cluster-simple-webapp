import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { VPC } from "./vpc";
import { ECS } from "./ecs";
import { ALB } from "./lb";

export class EcsClusterSimpleWebappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VPC(this, "VPC");
    const cluster = new ECS(this, "Cluster", { vpc: vpc.vpc });
    new ALB(this, "ALB", {vpc: vpc.vpc, service: cluster.service});

    // Output the cluster name
    new cdk.CfnOutput(this, "ClusterName", { value: cluster.clusterName });
  }
}

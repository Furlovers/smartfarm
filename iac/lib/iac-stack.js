const cdk = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const { Certificate } = require('aws-cdk-lib/aws-certificatemanager');
const route53 = require('aws-cdk-lib/aws-route53');
const route53Targets = require('aws-cdk-lib/aws-route53-targets');
const iam = require('aws-cdk-lib/aws-iam');
const constructs = require('constructs');

class IacStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const stage = 'main';
    const acmCertificateArn = process.env.SMARTFARM_ACM_CERTIFICATE_ARN;
    const alternativeDomain =
      'smartfarmmaua.com.br';
    const hostedZoneIdValue = process.env.SMARTFARM_HOSTED_ZONE_ID;
    const projectName = 'SmartfarmFront'; 

    const s3Bucket = new s3.Bucket(this, 'SmartfarmFrontBucket' + stage, {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      autoDeleteObjects: true
    });

    const oac = new cloudfront.CfnOriginAccessControl(this, 'AOC', {
      originAccessControlConfig: {
        name: 'Smartfarm Front Bucket OAC ' + stage,
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4'
      }
    });

    let viewerCertificate = cloudfront.ViewerCertificate.fromCloudFrontDefaultCertificate();
    
    if (stage === 'main') {
      viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(
        Certificate.fromCertificateArn(
          this,
          'SmartfarmFrontCertificate-' + stage,
          acmCertificateArn
        ),
        {
          aliases: [alternativeDomain],
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021
        }
      );
    }
    const cloudFrontWebDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'CDN',
      {
        comment: 'Smartfarm Front Distribution ' + stage,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: s3Bucket
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
                compress: true,
                cachedMethods: cloudfront.CloudFrontAllowedCachedMethods.GET_HEAD,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                minTtl: cdk.Duration.seconds(0),
                maxTtl: cdk.Duration.seconds(86400),
                defaultTtl: cdk.Duration.seconds(3600)
              }
            ]
          }
        ],
        viewerCertificate: viewerCertificate,
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
            errorCachingMinTtl: 0
          }
        ]
      }
    );

    const cfnDistribution = cloudFrontWebDistribution.node.defaultChild;

    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.getAtt('Id')
    );

    s3Bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [s3Bucket.arnForObjects('*')]
      })
    );

    if (stage === 'main') {
      const zone = route53.HostedZone.fromHostedZoneAttributes(
        this,
        'SmartfarmFrontHostedZone-' + stage,
        {
          hostedZoneId: hostedZoneIdValue,
          zoneName: alternativeDomain
        }
      );

      new route53.ARecord(this, 'SmartfarmFrontAliasRecord-' + stage, {
        zone: zone,
        recordName: alternativeDomain,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(cloudFrontWebDistribution)
        )
      });
    }

    new cdk.CfnOutput(this, 'SmartfarmFrontBucketName-' + stage, {
      value: s3Bucket.bucketName
    });

    new cdk.CfnOutput(this, 'SmartfarmFrontDistributionId-' + stage, {
      value: cloudFrontWebDistribution.distributionId
    });

    new cdk.CfnOutput(
      this,
      'SmartfarmFrontDistributionDomainName-' + stage,
      {
        value: cloudFrontWebDistribution.distributionDomainName
      }
    );
  }
}

module.exports = { IacStack };
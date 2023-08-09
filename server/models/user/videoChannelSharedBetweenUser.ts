import {
    AllowNull,
    Column,
    CreatedAt,
    Model,
    Table,
    UpdatedAt,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript'
  import { AttributesOnly } from '@shared/typescript-utils'
  import { Account, AccountSummary } from '../../../shared/models/actors'
  
  import {  WEBSERVER } from '../../initializers/constants'
  import {
    MAccountAP,
    MAccountFormattable,
    MAccountHost,
    MAccountSummaryFormattable,
    MChannelHost
  } from '../../types/models'
  import { buildSQLAttributes, getSort } from '../shared'
  import { VideoChannelModel } from '../video/video-channel'
  import { UserModel } from './user'
  
  @Table({
    tableName: 'videoChannelSharedBetweenUsers',
    indexes: [
      {
        fields: [ 'userId' ]
      },
      {
        fields: [ 'videoChannelId' ]
      }
    ]
  })
  export class VideoChannelSharedBetweenUserModel extends Model<Partial<AttributesOnly<VideoChannelSharedBetweenUserModel>>> {

    @AllowNull(false)
    @Column
    permission: string
  
    @CreatedAt
    createdAt: Date
  
    @UpdatedAt
    updatedAt: Date
  
    @ForeignKey(() => UserModel)
    @Column
    userId: number
  
    @BelongsTo(() => UserModel, {
      foreignKey: {
        allowNull: false
      }
    })
    User: UserModel
  
    @ForeignKey(() => VideoChannelModel)
    @Column
    videoChannelId: number
  
    @BelongsTo(() => VideoChannelModel, {
      foreignKey: {
        allowNull: false
      }
    })
    VideoChannel: VideoChannelModel
  
    static getSQLAttributes (tableName: string, aliasPrefix = '') {
      return buildSQLAttributes({
        model: this,
        tableName,
        aliasPrefix
      })
    }
  
    static listForApi (start: number, count: number, sort: string) {
      const query = {
        offset: start,
        limit: count,
        order: getSort(sort)
      }
  
      return Promise.all([
        VideoChannelSharedBetweenUserModel.count(),
        VideoChannelSharedBetweenUserModel.findAll(query)
      ]).then(([ total, data ]) => ({ total, data }))
    }
  
    toFormattedJSON (this: MAccountFormattable): Account {
      return {
        ...this.Actor.toFormattedJSON(),
  
        id: this.id,
        displayName: this.getDisplayName(),
        description: this.description,
        updatedAt: this.updatedAt,
        userId: this.userId ?? undefined
      }
    }
  
    toFormattedSummaryJSON (this: MAccountSummaryFormattable): AccountSummary {
      const actor = this.Actor.toFormattedSummaryJSON()
  
      return {
        id: this.id,
        displayName: this.getDisplayName(),
  
        name: actor.name,
        url: actor.url,
        host: actor.host,
        avatars: actor.avatars,
  
        // TODO: remove, deprecated in 4.2
        avatar: actor.avatar
      }
    }
  
    async toActivityPubObject (this: MAccountAP) {
      const obj = await this.Actor.toActivityPubObject(this.name)
  
      return Object.assign(obj, {
        summary: this.description
      })
    }
  
    getPermission () {
      return this.permission
    }
  
    // Avoid error when running this method on MAccount... | MChannel...
    getClientUrl (this: MAccountHost | MChannelHost) {
      return WEBSERVER.URL + '/a/' + this.Actor.getIdentifier()
    }
  }
  
<view class="weui-tab__content" hidden="{{activeIndex != 1}}">
		<block wx:for="{{lists}}" wx:for-item="list" wx:key="{{list.id}}">
			<view class="menu" id="{{list.id}}">
				<text class="menu_title">{{list.type_name}}</text>
				<view class="menu_item">
					<block wx:for="{{list.categoriesList}}" wx:for-item="item" wx:key="index">
						<!-- 取消选中样式 -->
						<view bindtap="cancel" class="active_item" wx:if="{{ (list.id +'_'+index) === curIndex }}">{{item.name}}</view>
					
						<!-- 选中样式 -->
						<view data-item="1" data-index="{{list.id}}_{{index}}" data-type="{{item.name}}" bindtap="selection" wx:else>{{item.name}}</view>
						<!-- 禁选 -->
						<view class="disabled" wx:if="">{{item.name}}</view>
					</block>
				</view>
			</view>
		</block>
	</view>
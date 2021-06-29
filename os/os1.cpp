//编写一个程序，实现FIFO、LRU和OPT页面置换算法。
//首先，生成一个随机的页面引用串，其中页面的范围为0 - 9。
//将这个随机页面引用串应用到每个算法，并记录每个算法引起的缺页错误的数量。
//实现置换算法，页面帧的数量可以从1 - 7。
#include<iostream>
#include<vector>
#include<queue>
#include<time.h>
using namespace std;

//默认页面帧数量为5
int frame_num = 3;

//输入为随机引用串，返回缺页错误的数量
int FIFO(vector<int> rand_num)
{
	int len = rand_num.size();

	//页面帧
	vector<int> frame(frame_num, -1);
	//记录缺页错误数量
	int count = 0;
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// 未出现缺页错误
			if (page == frame[j]) {
				flag = 1;
				break;
			}
		}
		// 出现缺页错误
		if (!flag) {
			count++;
			//将页面帧的第一个元素删除，将新替换的页面加入数组末尾
			frame.erase(frame.begin());
			frame.push_back(page);
			// 输出当前页面帧的情况
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
	}
	return count;
}
//输入为随机引用串，返回缺页错误的数量
int OPT(vector<int> rand_num) 
{
	int len = rand_num.size();
	
	// 页面帧
	vector<int> frame(frame_num, -1);
	// 记录缺页错误数量，初始化页面帧后引用串遍历的位置index
	int count = 0, index = 0;

	//初始化页面帧列表
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			if (page == frame[j]) {
				flag = 1;
				break;
			}
		}
		if (!flag) {
			count++;
			for (int k = 0; k < frame_num; k++) {
				if (frame[k] == -1) {
					frame[k] = page;
					break;
				}
			}
			// 输出当前页面帧的情况
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
		// 初始化完成
		if (count == frame_num) {
			index = i + 1;
			break;
		}
	}
	//相应地更新next_reference
	vector<int> next_ref(frame_num,100);
	for (int i = 0; i < frame_num; i++) {
		int current = frame[i];
		for (int j = index; j < len; j++) {
			if (rand_num[j] == current) {
				next_ref[i] = j;
				break;
			}
		}
	}

	for (int i = index; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// 未出现缺页错误
			if (page == frame[j]) {
				flag = 1;
				//更新该页面的下一个引用序列号
				int f = 0;
				for (int m = i + 1; m < len; m++) {
					if (rand_num[m] == page) {
						next_ref[j] = m;
						f = 1;
						break;
					}
				}
				// 该页面接下来都未被引用
				if (!f) {
					next_ref[j] = 100;
				}
			}
		}
		// 发生缺页错误，需要替换页面
		if (!flag) {
			count++;
			//查找下一个引用最晚的页面
			int temp = -1, it = -1;
			for (int k = 0; k < frame_num; k++) {
				if (next_ref[k] > temp) {
					temp = next_ref[k];
					it = k;
				}
			}
			frame[it] = page;//替换页面
			//更新引用列表
			int f = 0;
			for (int m = i + 1; m < len; m++) {
				if (rand_num[m] == page) {
					next_ref[it] = m;
					f = 1;
					break;
				}
			}
			// 新替换的页面接下来未被引用
			if (!f) {
				next_ref[it] = 100;
			}

			// 输出页面帧的情况
			for (int i = 0; i < frame_num; i++) {
				cout << frame[i] << " ";
			}
			cout << endl;
		}
	}
	return count;
}

// 输入为随机生成的引用串，返回缺页错误的数量
int LRU(vector<int> rand_num) 
{
	int len = rand_num.size();
	
	// 页面帧
	vector<int> frame(frame_num, -1);
	// 记录缺页错误数量，初始化页面帧后遍历到的引用串的序列号index
	int count = 0, index = 0;

	//初始化页面帧列表
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// 未发生缺页错误
			if (page == frame[j]) {
				flag = 1;
			}
		}
		// 发生缺页错误
		if (!flag) {
			count++;
			for (int k = 0; k < frame_num; k++) {
				if (frame[k] == -1) {
					frame[k] = page;
					break;
				}
			}
			// 输出页面帧情况
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
		// 初始化完成
		if (count == frame_num) {
			index = i + 1;
			break;
		}
	}
	//相应地更新 last_refernerce
	vector<int> last_ref(frame_num, 0);
	for (int i = 0; i < frame_num; i++) {
		int current = frame[i];
		for (int j = index - 1; j >= 0; j--) {
			if (current == rand_num[j]) {
				last_ref[i] = index - j;
				break;
			}
		}
	}

	for (int i = index; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// 每遍历引用串的下一个页面，所有页面的计数器加1
			last_ref[j]++;
			// 未出现缺页错误，更新该再次使用页面计数器为0
			if (page == frame[j]) {
				flag = 1;
				last_ref[j] = 0;
			}
		}
		// 出现缺页错误
		if (!flag) {
			count++;
			//查找最长时间没有使用的页面
			int temp = -1, it = -1;
			for (int k = 0; k < frame_num; k++) {
				if (last_ref[k] > temp) {
					temp = last_ref[k];
					it = k;
				}
			}
			// 替换页面，计数器也变为0
			frame[it] = page;
			last_ref[it] = 0;
			//输出页面帧的情况
			for (int i = 0; i < frame_num; i++) {
				cout << frame[i] << " ";
			}
			cout << endl;
		}
	}

	return count;
}

int main()
{
	//生成随机页面引用串
	srand(time(NULL));
	int len = rand() % 50 + 1;
	vector<int> rand_num(len);
	for (int i = 0; i < len; i++) {
		rand_num[i] = rand() % 10;
		cout << rand_num[i] << " ";
	}
	cout << endl;

	cout << "使用FIFO置换算法：" << endl;
	int count = FIFO(rand_num);
	cout << "产生" << count << "个缺页错误" << endl;

	cout << endl;

	cout << "使用OPT置换算法：" << endl;
	count = OPT(rand_num);
	cout << "产生" << count << "个缺页错误" << endl;

	cout << endl;

	cout << "使用LRU置换算法：" << endl;
	count = LRU(rand_num);
	cout << "产生" << count << "个缺页错误" << endl;
}
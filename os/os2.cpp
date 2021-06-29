//编写一个程序，实现以下磁盘调度算法：FCFS、SSTF、SCAN、C - SCAN、LOOK、C - LOOK，
//所编译程序处理具有5000柱面的磁盘，柱面号0 - 4999。
//该程序生成一个长度为1000的随机请求的序列，
//输入为磁头的初始位置，输出为每个算法的磁头移动的总的数量
#include<iostream>
#include<vector>
#include<time.h>
#include<algorithm>
using namespace std;

int FCFS(vector<int> requset, int start) 
{
	int len = requset.size();
	int count = requset[0] - start;
	for (int i = 1; i < len; i++) {
		count += abs(requset[i] - requset[i - 1]);
	}
	return count;
}

int SSTF(vector<int> request, int start)
{
	int len = request.size();
	vector<bool> visit(len,false);
	int current = start;
	int count = 0;
	//总共要访问len个页面
	for (int i = 0; i < len; i++) {
		//决定访问的第i个页面是哪个
		int temp = 5001, it = 5000;
		for (int j = 0; j < len; j++) {
			int dis = abs(request[j] - current);
			if (dis < temp && visit[j] == false) {
				temp = dis;
				it = j;
			}
		}
		count += temp;
		visit[it] = true;
		current = request[it];
	}
	return count;
}

int SCAN(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//大数方向移动
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += 4999 - request[len - 1];
		count += 4999 - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
	}

	//往小数方向移动
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[0] - 0;
		count += request[index] - 0;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int LOOK(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//大数方向移动
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
	}

	//往小数方向移动
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[index] - request[0];
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int C_SCAN(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//大数方向移动
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += 4999 - request[len - 1];
		count += 4999 - 0;
		count += request[0] - 0;
		for (int i = 1; i < index; i++) {
			count += request[i] - request[i - 1];
		}
	}

	//往小数方向移动
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[0] - 0;
		count += 4999 - 0;
		count += 4999 - request[len - 1];
		for (int i = len - 1; i > index; i--) {
			count += request[i] - request[i - 1];
		}
	}

	return count;
}

int C_LOOK(vector<int> request, int start, int direction)
{
	int len = request.size();
	sort(request.begin(), request.end());

	int index = 0, count = 0;
	for (int i = 0; i < len; i++) {
		if (request[i] >= start) {
			index = i;
			break;
		}
	}

	//大数方向移动
	if (direction == 0) {
		count = request[index] - start;
		for (int i = index + 1; i < len; i++) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[0];
		for (int i = 1; i < index; i++) {
			count += request[i] - request[i - 1];
		}
	}

	//往小数方向移动
	else {
		count = start - request[index - 1];
		for (int i = index - 1; i > 0; i--) {
			count += request[i] - request[i - 1];
		}
		count += request[len - 1] - request[0];
		for (int i = len - 1; i > index; i--) {
			count += request[i] - request[i - 1];
		}
	}
	return count;
}

int main()
{
	srand(time(NULL));
	vector<int> request(1000);
	for (int i = 0; i < 1000; i++) {
		request[i] = rand() % 5000;
	}
	int start,direction;
	cout<< "请输入磁头初始位置(0 - 4999):";
	cin >> start;
	cout << endl;
	cout << "请输入磁头初始移动方向，0为往大数方向，1为往小数方向:";
	cin >> direction;
	cout << endl;

	for (int i = 0; i < 1000; i++) {
		cout << request[i] << endl;
	}

	int count = FCFS(request, start);
	cout << "FCFS算法移动磁头的总数量为" << count << endl;

	count = SSTF(request, start);
	cout << "SSTF算法移动磁头的总数量为" << count << endl;

	count = SCAN(request, start,direction);
	cout << "SCAN算法移动磁头的总数量为" << count << endl;

	count = C_SCAN(request, start, direction);
	cout << "C-SCAN算法移动磁头的总数量为" << count << endl;

	count = LOOK(request, start, direction);
	cout << "LOOK算法移动磁头的总数量为" << count << endl;

	count = C_LOOK(request, start, direction);
	cout << "C-LOOK算法移动磁头的总数量为" << count << endl;
}
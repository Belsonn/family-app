import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reward } from 'src/app/utils/reward.models';

@Component({
  selector: 'app-unlock-reward',
  templateUrl: './unlock-reward.component.html',
  styleUrls: ['./unlock-reward.component.scss'],
})
export class UnlockRewardComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { reward: Reward; points: number }
  ) {}

  ngOnInit(): void {}
}
